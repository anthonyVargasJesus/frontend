import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EvaluationService } from 'app/services/evaluation.service';
import { StandardService } from 'app/services/standard.service';
import { Standard } from 'app/models/standard';
import { ErrorManager } from 'app/errors/error-manager';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Radar de madurez por dominio del Anexo A: en vez del % de controles agregado que ya
// muestran el dashboard de Inicio y Cumplimiento Histórico, desglosa dominio por dominio (A.5,
// A.6, A.7...) y compara contra el ciclo anterior — la pregunta "¿qué dominio arrastra el
// promedio?" que un solo número no responde. Reutiliza <app-radar-chart> (el mismo wrapper de
// ngx-charts-polar-chart que ya usa el dashboard de Inicio), y el mismo patrón de exportación
// PDF/Excel que compliance-evolution.component.ts.
@Component({
  selector: 'app-maturity-radar',
  templateUrl: './maturity-radar.component.html',
  styleUrls: ['./maturity-radar.component.scss']
})
export class MaturityRadarComponent implements OnInit {

  @Input()
  embedded = false;

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

  colorScheme = { domain: ['#7367f0', '#82868b'], group: 'Ordinal', selectable: true, name: 'Custom Scheme' };

  constructor(
    private evaluationService: EvaluationService,
    private standardService: StandardService,
  ) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Radar de Madurez por Dominio',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Proceso de Evaluación', isLink: false, link: '#' },
          { name: 'Radar de Madurez', isLink: false, link: '#' }
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
    const requestedStandardId = this.embedded ? this.standardId : this.selectedStandardId;
    this.evaluationService.getMaturityRadar(requestedStandardId).subscribe({
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

  // Forma que espera <app-radar-chart> (ngx-charts, multi-series): una serie "Actual" siempre,
  // y "Ciclo anterior" solo si hay evaluación previa con la que comparar.
  get radarData(): any[] {
    if (!this.data?.domains?.length) return [];
    const series: any[] = [{
      name: 'Actual',
      series: this.data.domains.map((d: any) => ({ name: d.name, value: d.currentRate ?? 0 })),
    }];
    if (this.data.previousEvaluationId) {
      series.push({
        name: 'Ciclo anterior',
        series: this.data.domains.map((d: any) => ({ name: d.name, value: d.previousRate ?? 0 })),
      });
    }
    return series;
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

  getRateLabel(rate: number | null | undefined): string {
    if (rate === null || rate === undefined) return '—';
    return rate.toFixed(1) + '%';
  }

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
        pdf.text('Radar de Madurez por Dominio', margin, margin + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        const subtitle = `${this.data?.standardName || ''} · Generado el ${new Date().toLocaleString('es-PE')}`;
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

      pdf.save(`Radar_Madurez_${this.data?.standardName || ''}_${Date.now()}.pdf`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exportingPdf = false;
    }
  }

  async exportExcel(): Promise<void> {
    if (this.exporting || !this.data) return;
    this.exporting = true;
    try {
      const workbook = new ExcelJS.Workbook();

      const sheet = workbook.addWorksheet('Radar por Dominio');
      sheet.columns = [
        { header: 'Dominio', key: 'code', width: 10 },
        { header: 'Nombre', key: 'name', width: 45 },
        { header: '% Actual', key: 'currentRate', width: 12 },
        { header: '% Ciclo anterior', key: 'previousRate', width: 16 },
        { header: 'Delta', key: 'delta', width: 10 },
        { header: 'Controles evaluados', key: 'evaluatedControls', width: 18 },
        { header: 'Total controles', key: 'totalControls', width: 16 },
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EEF7' } };
      for (const d of (this.data.domains || [])) {
        sheet.addRow(d);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Radar_Madurez_${this.data.standardName || ''}_${Date.now()}.xlsx`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exporting = false;
    }
  }

}
