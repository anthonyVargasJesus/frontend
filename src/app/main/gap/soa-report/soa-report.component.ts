import { Component, OnInit } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { GapDashboardService } from 'app/services/gap-dashboard.service';
import { ErrorManager } from 'app/errors/error-manager';

interface SoaControl {
  code: string;
  name: string;
  description: string;
  theme: string;
  // null = todavía sin evaluar; true/false = aplica o no — mismo campo que devuelve el backend,
  // no se recalcula acá.
  aplica: boolean | null;
  implementacion: string;
  justificacion: string;
}

interface SoaThemeGroup {
  theme: string;
  items: SoaControl[];
}

const COLOR_ACCENT = '#2F6F5E';
const COLOR_ERROR = '#A8443B';
const COLOR_MUTED = '#6B7480';

/**
 * "SOA" (Declaración de Aplicabilidad, ISO 27001 cláusula 6.1.3 d) — misma pantalla que la app
 * móvil: header con el conteo de controles del Anexo A y botón de exportar, aviso si quedan
 * controles sin evaluar, y una tarjeta por control con su estado "Aplica/No aplica" + nivel de
 * madurez + justificación. Carga con GET /api/gapDashboard/soa-report (mismo endpoint propio que
 * usa Flutter, no reutiliza /gap/evaluacion). El export es 100% client-side (como en la app
 * móvil, que tampoco pega contra el backend para esto) — acá con ExcelJS en vez del share sheet
 * nativo, ya que el navegador de escritorio no tiene un equivalente real.
 */
@Component({
  selector: 'app-soa-report',
  templateUrl: './soa-report.component.html',
  styleUrls: ['./soa-report.component.scss']
})
export class SoaReportComponent implements OnInit {

  loading = true;
  errorMessage = '';
  exporting = false;

  hasCurrentEvaluation = true;
  standardName = '';
  controls: SoaControl[] = [];

  contentHeader: object;

  constructor(private _gapDashboardService: GapDashboardService) { }

  ngOnInit(): void {
    this.initContentHeader();
    this.load();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'SOA',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Evaluación', isLink: false, link: '#' },
          { name: 'SOA', isLink: false },
        ]
      }
    };
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this._gapDashboardService.getSoaReport().subscribe((res: any) => {
      this.hasCurrentEvaluation = !!res.hasCurrentEvaluation;
      this.standardName = res.standardName || '';
      this.controls = res.controls || [];
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudo cargar el SOA. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  get subtitle(): string {
    const dateText = this.formatDate(new Date());
    return `${this.controls.length} controles del Anexo A · generado automáticamente desde la evaluación · ${this.standardName} · ${dateText}`;
  }

  private formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()}`;
  }

  get pendingCount(): number {
    return this.controls.filter(c => c.aplica === null).length;
  }

  // Agrupa manteniendo el orden en que ya vienen (el backend los ordena por groupNumber/código),
  // sin volver a ordenar acá -- mismo criterio que "Agrupar por tema" en otras pantallas, pero
  // siempre activo en esta vista (no es un toggle, la tabla del SOA siempre se ve por área, como
  // el Excel de referencia).
  get groupedControls(): SoaThemeGroup[] {
    const groups: SoaThemeGroup[] = [];
    const byTheme = new Map<string, SoaThemeGroup>();
    for (const c of this.controls) {
      let group = byTheme.get(c.theme);
      if (!group) {
        group = { theme: c.theme, items: [] };
        byTheme.set(c.theme, group);
        groups.push(group);
      }
      group.items.push(c);
    }
    return groups;
  }

  aplicaLabel(c: SoaControl): string {
    return c.aplica === null ? 'Sin evaluar' : (c.aplica ? 'Aplica' : 'No aplica');
  }

  // Mismo criterio que la app móvil: el pill "Aplica/No aplica" sí se colorea por estado; el de
  // "implementación" (nivel de madurez) siempre queda gris, no se repite el color ahí.
  aplicaColor(c: SoaControl): string {
    if (c.aplica === null) return COLOR_MUTED;
    return c.aplica ? COLOR_ACCENT : COLOR_ERROR;
  }

  trackByCode(_index: number, c: SoaControl): string {
    return c.code;
  }

  pillBackground(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }

  async exportExcel() {
    if (this.exporting || this.controls.length === 0) return;
    this.exporting = true;
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('SOA');
      sheet.columns = [
        { header: 'Código', key: 'code', width: 12 },
        { header: 'Control', key: 'name', width: 32 },
        { header: 'Descripción', key: 'description', width: 50 },
        { header: 'Área', key: 'theme', width: 26 },
        { header: '¿Aplica?', key: 'aplica', width: 14 },
        { header: 'Nivel de madurez', key: 'implementacion', width: 18 },
        { header: 'Justificación', key: 'justificacion', width: 55 },
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EEF7' } };

      for (const c of this.controls) {
        sheet.addRow({
          code: c.code,
          name: c.name,
          description: c.description,
          theme: c.theme,
          aplica: c.aplica === null ? 'Sin evaluar' : (c.aplica ? 'Sí' : 'No'),
          implementacion: c.implementacion,
          justificacion: c.justificacion,
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `SOA_${Date.now()}.xlsx`);
    } catch (error) {
      ErrorManager.handleError(error);
    } finally {
      this.exporting = false;
    }
  }

}
