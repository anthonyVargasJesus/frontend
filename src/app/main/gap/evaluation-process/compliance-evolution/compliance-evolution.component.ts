import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EvaluationService } from 'app/services/evaluation.service';
import { StandardService } from 'app/services/standard.service';
import { Standard } from 'app/models/standard';
import { ErrorManager } from 'app/errors/error-manager';
import { curveLinear } from 'd3-shape';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-compliance-evolution',
  templateUrl: './compliance-evolution.component.html',
  styleUrls: ['./compliance-evolution.component.scss']
})

export class ComplianceEvolutionComponent implements OnInit {

  @Input()
  embedded = false;

  // Cuando se embebe (ver resume/home.component.html) el padre ya resolvió la norma de
  // la evaluación actual y la pasa acá — se respeta tal cual, sin desplegable propio, para
  // no desentonar con las demás pestañas de esa pantalla (todas fijas a esa norma). En uso
  // standalone (ruta propia) sí se muestra el desplegable pedido, preseleccionado con la
  // norma que el backend resuelve por defecto (la de la evaluación "actual").
  @Input()
  standardId?: number;

  loading = false;
  exporting = false;
  exportingPdf = false;
  data: any = null;

  @ViewChild('reportContent') reportContentRef?: ElementRef<HTMLDivElement>;

  standards: Standard[] = [];
  selectedStandardId?: number;

  public contentHeader: object = {};

  curveLinear = curveLinear;
  lineColorScheme = { domain: ['#7367f0', '#28c76f', '#ff9f43'] };

  constructor(
    private evaluationService: EvaluationService,
    private standardService: StandardService,
  ) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Evolución de Cumplimiento Histórico',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Proceso de Evaluación', isLink: false, link: '#' },
          { name: 'Cumplimiento Histórico', isLink: false, link: '#' }
        ]
      }
    };

    if (!this.embedded) {
      this.standardService.getAll().subscribe({
        next: (res: any) => this.standards = res.data,
        error: (error) => ErrorManager.handleError(error),
      });
    }

    this.load();
  }

  onStandardChange(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    // Embebido: manda siempre la norma que pasó el padre (@Input). Standalone: manda la
    // elegida en el desplegable (undefined la primera vez, para que el backend resuelva
    // el default) — se sincroniza con la respuesta más abajo para dejarlo preseleccionado.
    const requestedStandardId = this.embedded ? this.standardId : this.selectedStandardId;
    this.evaluationService.getComplianceEvolution(requestedStandardId).subscribe({
      next: (res: any) => {
        this.data = res?.data ?? res;
        if (!this.embedded) this.selectedStandardId = this.data?.standardId;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRateLabel(rate: number | null | undefined): string {
    if (rate === null || rate === undefined) return '—';
    return rate.toFixed(1) + '%';
  }

  getDeltaClass(delta: number | null | undefined): string {
    if (delta === null || delta === undefined) return 'text-muted';
    if (delta > 0) return 'text-success';
    if (delta < 0) return 'text-danger';
    return 'text-muted';
  }

  getDeltaIcon(delta: number | null | undefined): string {
    if (delta === null || delta === undefined) return '—';
    if (delta > 0) return '↑ +' + delta.toFixed(1) + '%';
    if (delta < 0) return '↓ ' + delta.toFixed(1) + '%';
    return '= 0%';
  }

  getCompletionBarClass(rate: number | null | undefined): string {
    if (rate === null || rate === undefined) return 'bg-secondary';
    if (rate >= 75) return 'bg-success';
    if (rate >= 50) return 'bg-info';
    if (rate >= 25) return 'bg-warning';
    return 'bg-danger';
  }

  yAxisTickFormatting(value: number): string {
    return value.toFixed(0) + '%';
  }

  // PDF: instantánea visual real (tarjetas, gráfico de línea, composición, mejoras/
  // retrocesos) — NO usa window.print(): el gráfico es un SVG de ngx-charts dimensionado
  // por JS contra el viewport de pantalla, y en el diálogo de impresión del navegador
  // (media "print", otro layout de página) salía en blanco — quedaba un PDF de puro texto,
  // sin gráfico. En su lugar, html2canvas rasteriza #reportContent tal cual está pintado en
  // pantalla (con el SVG ya resuelto) y jsPDF arma el documento a partir de esa imagen, con
  // título/fecha propios del PDF (no forman parte de la captura) y márgenes reales — cada
  // página recorta (clip) la franja de imagen que le toca, así nunca pisa el margen.
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

      // Solo en la primera página: título del reporte + norma + fecha de generación,
      // separados del contenido por una línea fina. Esto va aparte de la captura (texto
      // real seleccionable, no parte del PNG).
      const drawHeader = () => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(45, 45, 45);
        pdf.text('Evolución de Cumplimiento Histórico', margin, margin + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        const subtitle = `${this.data?.standardName || ''} · Generado el ${new Date().toLocaleString('es-PE')}`;
        pdf.text(subtitle, margin, margin + 10.5);
        pdf.setDrawColor(225, 225, 225);
        pdf.line(margin, margin + 13, pageWidth - margin, margin + 13);
      };
      const headerBlockMm = 18; // alto reservado para título+subtítulo+línea+aire, solo página 1

      drawHeader();

      let renderedMm = 0; // cuánto de la imagen ya se dibujó en páginas anteriores
      let pageIndex = 0;
      while (renderedMm < imgHeightMm) {
        const top = margin + (pageIndex === 0 ? headerBlockMm : 0);
        const availableMm = pageHeight - margin - top;

        pdf.saveGraphicsState();
        pdf.rect(margin, top, imgWidthMm, availableMm, null); // path sin pintar, solo para recortar
        pdf.clip();
        pdf.discardPath();
        pdf.addImage(imgData, 'PNG', margin, top - renderedMm, imgWidthMm, imgHeightMm);
        pdf.restoreGraphicsState();

        renderedMm += availableMm;
        pageIndex++;
        if (renderedMm < imgHeightMm) pdf.addPage();
      }

      pdf.save(`Evolucion_Cumplimiento_${this.data?.standardName || ''}_${Date.now()}.pdf`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exportingPdf = false;
    }
  }

  // Excel: mismo patrón que ya usa soa-report.component.ts (ExcelJS + file-saver,
  // 100% cliente, sin pegarle al backend) — acá con 2 hojas: el historial completo
  // (una fila por evaluación) y los cambios ítem por ítem del último ciclo comparado.
  async exportExcel(): Promise<void> {
    if (this.exporting || !this.data) return;
    this.exporting = true;
    try {
      const workbook = new ExcelJS.Workbook();

      const historial = workbook.addWorksheet('Historial');
      historial.columns = [
        { header: 'Evaluación', key: 'description', width: 30 },
        { header: 'Inicio', key: 'startDate', width: 14 },
        { header: 'Fin', key: 'endDate', width: 14 },
        { header: '% Requisitos', key: 'requirementsRate', width: 14 },
        { header: '% Controles', key: 'controlsRate', width: 14 },
        { header: '% General', key: 'overallRate', width: 14 },
      ];
      historial.getRow(1).font = { bold: true };
      historial.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EEF7' } };
      for (const ev of (this.data.evaluations || [])) {
        historial.addRow({
          description: ev.description,
          startDate: ev.startDate ? new Date(ev.startDate).toLocaleDateString('es-PE') : '',
          endDate: ev.endDate ? new Date(ev.endDate).toLocaleDateString('es-PE') : '',
          requirementsRate: ev.requirementsRate ?? '',
          controlsRate: ev.controlsRate ?? '',
          overallRate: ev.overallRate ?? '',
        });
      }

      if (this.data.changes?.length) {
        const cambios = workbook.addWorksheet('Cambios');
        cambios.columns = [
          { header: 'Tipo', key: 'tipo', width: 12 },
          { header: 'Código', key: 'code', width: 12 },
          { header: 'Nombre', key: 'name', width: 55 },
          { header: 'Nivel anterior', key: 'previousLevel', width: 16 },
          { header: 'Nivel actual', key: 'currentLevel', width: 16 },
          { header: 'Mejoró', key: 'improved', width: 10 },
        ];
        cambios.getRow(1).font = { bold: true };
        cambios.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EEF7' } };
        for (const c of this.data.changes) {
          cambios.addRow({
            tipo: c.tipo,
            code: c.code,
            name: c.name,
            previousLevel: c.previousLevel,
            currentLevel: c.currentLevel,
            improved: c.improved ? 'Sí' : 'No',
          });
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Evolucion_Cumplimiento_${this.data.standardName || ''}_${Date.now()}.xlsx`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exporting = false;
    }
  }

}
