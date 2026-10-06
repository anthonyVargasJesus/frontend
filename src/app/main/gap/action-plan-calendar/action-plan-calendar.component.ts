import { Component, OnInit } from '@angular/core';
import { GapService } from 'app/services/gap.service';
import { ActionPlanService } from 'app/services/action-plan.service';
import { ErrorManager } from 'app/errors/error-manager';
import { getResults } from 'app/config/config';

interface CalendarItem {
  actionPlanId: number;
  controlCode: string;
  controlName: string;
  title: string;
  responsibleName: string | null;
  startDate: Date;
  dueDate: Date;
  statusName: string;
  statusAbbreviation: string;
  statusColor: string;
  // Meses (0-11) del año actualmente cargado que caen dentro de [startDate, dueDate] -- solo
  // para pintar la fila (la página visible); el resumen por estado del pie de tabla lo calcula
  // el backend sobre el total, no esto.
  monthsInYear: Set<number>;
}

// Una fila por cada estado real de MAE_ACTION_PLAN_STATUS (no una lista fija) -- si la empresa
// agrega, renombra o borra un estado, esta pantalla se ajusta sola.
interface StatusSummary {
  statusId: number;
  statusName: string;
  statusColor: string;
  monthCounts: number[];
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const PAGE_SIZE = 15;

/**
 * "Plan de Acción / Implementación", vista calendario: un plan de acción por fila, con su
 * rango de fechas real (D_START_DATE/D_DUE_DATE) resaltado sobre una grilla de 12 meses --
 * mismo espíritu que la hoja "Implementación" del Excel de referencia (planificación mensual +
 * filas de resumen mensual), pero con datos reales en vez de casilleros que se completan a
 * mano, y con el resumen mensual desglosado por los estados reales de la empresa (no una lista
 * fija Planificado/Ejecutado/Avance). Paginado: puede haber muchos planes de acción por evaluación.
 */
@Component({
  selector: 'app-action-plan-calendar',
  templateUrl: './action-plan-calendar.component.html',
  styleUrls: ['./action-plan-calendar.component.scss']
})
export class ActionPlanCalendarComponent implements OnInit {

  loading = true;
  errorMessage = '';
  contentHeader: object;

  meses = MESES;
  year = new Date().getFullYear();
  items: CalendarItem[] = [];
  statusSummary: StatusSummary[] = [];

  // Paginación -- mismo patrón que el resto del proyecto (skip/pageSize, prev/next).
  skip = 0;
  pageSize = PAGE_SIZE;
  page = 1;
  total = 0;
  totalPages = 0;
  results = '';
  previous = true;
  next = true;

  private evaluationId: number;

  constructor(
    private _gapService: GapService,
    private _actionPlanService: ActionPlanService,
  ) { }

  ngOnInit(): void {
    this.initContentHeader();
    this.load();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'Implementación',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Reportes', isLink: false, link: '#' },
          { name: 'Implementación', isLink: false },
        ]
      }
    };
  }

  // Carga la evaluación actual una sola vez; después de eso, cambios de año o de página
  // reusan evaluationId y solo vuelven a pedir /calendar (ver getCalendar()).
  load() {
    this.loading = true;
    this.errorMessage = '';
    this._gapService.getResumen(false).subscribe((res: any) => {
      this.evaluationId = res.evaluation?.evaluationId;
      if (!this.evaluationId) {
        this.loading = false;
        return;
      }
      this.getCalendar();
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudo cargar el plan de acción. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  private getCalendar() {
    this.loading = true;
    this._actionPlanService.getCalendar(this.evaluationId, this.year, this.skip, this.pageSize).subscribe((res: any) => {
      this.items = (res.items || []).map((dto: any) => this.toCalendarItem(dto));
      this.statusSummary = res.statusSummary || [];
      this.total = res.pagination?.totalRows ?? this.items.length;
      this.totalPages = res.pagination?.totalPages ?? 1;
      this.page = (this.skip / this.pageSize) + 1;
      this.results = getResults(this.total, this.totalPages);
      this.previous = this.page <= 1;
      this.next = this.page >= this.totalPages;
      this.loading = false;
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });
  }

  changeYear(delta: number) {
    this.year += delta;
    this.skip = 0;
    this.getCalendar();
  }

  changePage(delta: number) {
    const desde = this.skip + delta;
    if (desde >= this.total || desde < 0) return;
    this.skip += delta;
    this.getCalendar();
  }

  private toCalendarItem(dto: any): CalendarItem {
    const startDate = new Date(dto.startDate);
    const dueDate = new Date(dto.dueDate);
    return {
      actionPlanId: dto.actionPlanId,
      controlCode: dto.controlCode,
      controlName: dto.controlName,
      title: dto.title,
      responsibleName: dto.responsibleName,
      startDate,
      dueDate,
      statusName: dto.statusName,
      statusAbbreviation: dto.statusAbbreviation,
      statusColor: dto.statusColor,
      monthsInYear: this.getMonthsInYear(startDate, dueDate),
    };
  }

  private getMonthsInYear(startDate: Date, dueDate: Date): Set<number> {
    const months = new Set<number>();
    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(this.year, m, 1);
      const monthEnd = new Date(this.year, m + 1, 0);
      if (startDate <= monthEnd && dueDate >= monthStart) months.add(m);
    }
    return months;
  }

  trackByItem(_index: number, item: CalendarItem): number {
    return item.actionPlanId;
  }

  trackByStatus(_index: number, status: StatusSummary): number {
    return status.statusId;
  }

}
