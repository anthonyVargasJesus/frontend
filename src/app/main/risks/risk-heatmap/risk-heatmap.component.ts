import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RiskService } from 'app/services/risk.service';
import { ErrorManager } from 'app/errors/error-manager';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Mapa de calor de riesgos: amenaza (eje X) x vulnerabilidad (eje Y), con dos vistas
// alternables — "Inherente" (evaluación cruda) y "Residual" (exposición real hoy, descontando
// el avance efectivo de los controles). Mismo patrón de exportación PDF/Excel que
// compliance-evolution.component.ts (html2canvas + jsPDF / ExcelJS + file-saver), reutilizado
// tal cual para no reinventar esa parte.
@Component({
  selector: 'app-risk-heatmap',
  templateUrl: './risk-heatmap.component.html',
  styleUrls: ['./risk-heatmap.component.scss']
})
export class RiskHeatmapComponent implements OnInit {

  loading = false;
  exporting = false;
  exportingPdf = false;
  data: any = null;

  // Vista activa de la grilla — el backend ya manda ambas ('inherent' y 'residual') en la
  // misma respuesta, así que alternar es instantáneo (sin otro viaje al servidor).
  view: 'inherent' | 'residual' = 'residual';

  @ViewChild('reportContent') reportContentRef?: ElementRef<HTMLDivElement>;

  public contentHeader: object = {};

  constructor(private riskService: RiskService) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Mapa de Calor de Riesgos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'RIESGOS', isLink: false, link: '#' },
          { name: 'Mapa de Calor', isLink: false }
        ]
      }
    };
    this.load();
  }

  load(): void {
    this.loading = true;
    this.riskService.getHeatmap().subscribe({
      next: (res: any) => {
        this.data = res?.data ?? res;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        ErrorManager.handleError(error);
      }
    });
  }

  get grid(): any {
    return this.data ? this.data[this.view] : null;
  }

  // El parser de plantillas de esta versión de Angular no soporta encadenar "?.[0]" (índice
  // con navegación segura) directamente en el HTML — se resuelve acá en TS, donde sí está
  // disponible desde TypeScript 3.7.
  get topRisk(): any {
    return this.data?.topResidualRisks?.[0] ?? null;
  }

  // El backend manda matrix[row][col] con row 0 = vulnerabilidad más baja — para pintarla con
  // la esquina crítica arriba a la derecha (como cualquier matriz de riesgo estándar) hay que
  // recorrer las filas de arriba hacia abajo, es decir de mayor a menor índice.
  get rowsTopDown(): number[] {
    const rows = this.grid?.matrix?.length ?? 0;
    return Array.from({ length: rows }, (_, i) => rows - 1 - i);
  }

  cellStyle(cell: any): { [k: string]: string } {
    return {
      'background-color': cell?.color || '#EAEDEF',
    };
  }

  textColorFor(color: string | null | undefined): string {
    if (!color) return '#3b4253';
    // Contraste aproximado: colores oscuros -> texto blanco, claros -> texto oscuro.
    const hex = color.replace('#', '');
    if (hex.length !== 6) return '#3b4253';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#3b4253' : '#ffffff';
  }

  setView(v: 'inherent' | 'residual'): void {
    this.view = v;
  }

  // PDF: mismo enfoque que compliance-evolution.component.ts — html2canvas rasteriza el
  // contenido tal cual está pintado en pantalla (incluida la grilla, que es CSS puro, no SVG,
  // así que esto es aún más directo que con un gráfico de ngx-charts).
  async exportPdf(): Promise<void> {
    const el = this.reportContentRef?.nativeElement;
    if (this.exportingPdf || !el) return;
    this.exportingPdf = true;
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const contentWidthMm = pageWidth - margin * 2;
      const imgWidthMm = contentWidthMm;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      const drawHeader = () => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(45, 45, 45);
        pdf.text('Mapa de Calor de Riesgos', margin, margin + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        const viewLabel = this.view === 'inherent' ? 'Riesgo inherente' : 'Riesgo residual';
        const subtitle = `${this.data?.evaluationDescription || ''} · ${viewLabel} · Generado el ${new Date().toLocaleString('es-PE')}`;
        pdf.text(subtitle, margin, margin + 10.5);
        pdf.setDrawColor(225, 225, 225);
        pdf.line(margin, margin + 13, pageWidth - margin, margin + 13);
      };
      const headerBlockMm = 18;

      drawHeader();

      let renderedMm = 0;
      let pageIndex = 0;
      while (renderedMm < imgHeightMm) {
        const top = margin + (pageIndex === 0 ? headerBlockMm : 0);
        const availableMm = pageHeight - margin - top;

        pdf.saveGraphicsState();
        pdf.rect(margin, top, imgWidthMm, availableMm, null);
        pdf.clip();
        pdf.discardPath();
        pdf.addImage(imgData, 'PNG', margin, top - renderedMm, imgWidthMm, imgHeightMm);
        pdf.restoreGraphicsState();

        renderedMm += availableMm;
        pageIndex++;
        if (renderedMm < imgHeightMm) pdf.addPage();
      }

      pdf.save(`Mapa_Calor_Riesgos_${this.data?.evaluationDescription || ''}_${Date.now()}.pdf`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exportingPdf = false;
    }
  }

  // Excel: mismo patrón que ya usan soa-report.component.ts y compliance-evolution.component.ts
  // (ExcelJS + file-saver, 100% cliente) — acá con la lista completa de riesgos residuales
  // (no solo el top 10 que se ve en pantalla no hace falta: el backend ya prioriza los que
  // importan) más el resumen por nivel de ambas vistas.
  async exportExcel(): Promise<void> {
    if (this.exporting || !this.data) return;
    this.exporting = true;
    try {
      const workbook = new ExcelJS.Workbook();

      const top = workbook.addWorksheet('Riesgos Residuales');
      top.columns = [
        { header: 'Riesgo', key: 'name', width: 45 },
        { header: 'Activo', key: 'activesInventoryName', width: 30 },
        { header: 'Nivel inherente', key: 'inherentLevel', width: 16 },
        { header: 'Valor inherente', key: 'inherentValue', width: 14 },
        { header: 'Nivel residual', key: 'residualLevel', width: 16 },
        { header: 'Valor residual', key: 'residualValue', width: 14 },
        { header: 'Controles', key: 'controlSummary', width: 14 },
      ];
      top.getRow(1).font = { bold: true };
      top.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EEF7' } };
      for (const r of (this.data.topResidualRisks || [])) {
        top.addRow(r);
      }

      const resumen = workbook.addWorksheet('Resumen por nivel');
      resumen.columns = [
        { header: 'Vista', key: 'vista', width: 14 },
        { header: 'Nivel', key: 'name', width: 20 },
        { header: 'Cantidad', key: 'count', width: 12 },
        { header: '%', key: 'percentage', width: 10 },
      ];
      resumen.getRow(1).font = { bold: true };
      resumen.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EEF7' } };
      for (const s of (this.data.inherent?.byLevel || [])) {
        resumen.addRow({ vista: 'Inherente', name: s.name, count: s.count, percentage: s.percentage });
      }
      for (const s of (this.data.residual?.byLevel || [])) {
        resumen.addRow({ vista: 'Residual', name: s.name, count: s.count, percentage: s.percentage });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Mapa_Calor_Riesgos_${this.data.evaluationDescription || ''}_${Date.now()}.xlsx`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exporting = false;
    }
  }

}
