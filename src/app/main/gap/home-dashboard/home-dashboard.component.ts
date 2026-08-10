import { Component, OnInit } from '@angular/core';
import { GapDashboardService } from 'app/services/gap-dashboard.service';
import { ErrorManager } from 'app/errors/error-manager';

interface MaturityCount { name: string; count: number; }
interface DashboardTheme { theme: string; totalItems: number; evaluatedItems: number; compliantItems: number; percentage: number; }
interface PendingItem { tipo: string; itemId: number; code: string; name: string; theme: string; }
interface BreachSeverity { name: string; color: string; count: number; }

interface GapDashboard {
  totalItems: number;
  evaluatedItems: number;
  compliantItems: number;
  compliancePercentage: number;
  openBreachesCount: number;
  overdueActionPlansCount: number;
  evaluatedItemsWithEvidenceCount: number;
  maturityCounts: MaturityCount[];
  themes: DashboardTheme[];
  pendingItems: PendingItem[];
  breachSeverityBreakdown: BreachSeverity[];
}

interface DonutSegment { name: string; count: number; color: string; dasharray: string; dashoffset: number; }

// Mismo orden fijo que usa la app móvil para pintar la leyenda/anillo — no es el orden en que
// llega maturityCounts del backend (ese es un GroupBy sin orden garantizado).
const MATURITY_ORDER = ['Cumple', 'Parcial', 'No cumple', 'No aplica', 'Pendiente'];
const MATURITY_COLOR: { [name: string]: string } = {
  'Cumple': '#2F6F5E',
  'Parcial': '#B07A1F',
  'No cumple': '#A8443B',
  'No aplica': '#6B7480',
  'Pendiente': '#8A939B',
};

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * "Inicio" — mismo dashboard que la app móvil (HomeDashboardPage): anillo de cumplimiento,
 * "Por área", 4 tiles de estadísticas, brechas por severidad y "Continuar evaluando". Todo el
 * cálculo (%, conteos, brechas abiertas/vencidas) ya lo hace el backend en un solo endpoint
 * (GET /api/gapDashboard/bootstrap) — este componente solo formatea/deriva lo puramente visual
 * (orden fijo de la leyenda, colores por umbral, el path del anillo SVG).
 *
 * A propósito no incluye la sección "Notificaciones recientes" que sí trae este mismo bootstrap
 * (el screenshot de referencia no la mostraba y el proyecto todavía no tiene una pantalla de
 * notificaciones a la que enlazar "Ver todas") — si hace falta, es un agregado chico partiendo
 * de "notifications"/"unreadNotificationsCount", que ya se reciben y se ignoran.
 */
@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit {

  loading = true;
  errorMessage = '';

  dashboard: GapDashboard | null = null;

  contentHeader: object;

  constructor(private _gapDashboardService: GapDashboardService) { }

  ngOnInit(): void {
    this.initContentHeader();
    this.load();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'Inicio',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'GAP', isLink: false, link: '#' },
          { name: 'Inicio', isLink: false },
        ]
      }
    };
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this._gapDashboardService.getBootstrap(3).subscribe((res: any) => {
      this.dashboard = res.dashboard || null;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudo cargar el dashboard. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  // Segmentos del anillo en el orden fijo Cumple/Parcial/No cumple/No aplica/Pendiente,
  // saltando los que están en cero — mismo criterio que _order en home_dashboard_page.dart.
  // maturityCounts ya suma totalItems (incluye Pendiente/No aplica), así que cada segmento es
  // proporción directa sobre el total, sin recalcular nada.
  get donutSegments(): DonutSegment[] {
    if (!this.dashboard || this.dashboard.totalItems === 0) return [];
    const byName = new Map(this.dashboard.maturityCounts.map(m => [m.name, m.count]));
    let offset = 0;
    const segments: DonutSegment[] = [];
    for (const name of MATURITY_ORDER) {
      const count = byName.get(name) || 0;
      if (count === 0) continue;
      const length = (count / this.dashboard.totalItems) * CIRCUMFERENCE;
      segments.push({
        name, count,
        color: MATURITY_COLOR[name] || '#8A939B',
        dasharray: `${length} ${CIRCUMFERENCE - length}`,
        dashoffset: -offset,
      });
      offset += length;
    }
    return segments;
  }

  legendCount(name: string): number {
    return this.dashboard?.maturityCounts.find(m => m.name === name)?.count || 0;
  }

  get visibleLegend(): { name: string; count: number; color: string }[] {
    return MATURITY_ORDER
      .map(name => ({ name, count: this.legendCount(name), color: MATURITY_COLOR[name] }))
      .filter(l => l.count > 0);
  }

  // Verde ≥80%, ámbar ≥50%, rojo <50% — mismo umbral que _accent() en la app móvil. Gris si el
  // área todavía no tiene nada evaluado (no confundir "sin datos" con "mal").
  themeColor(theme: DashboardTheme): string {
    if (theme.evaluatedItems === 0) return '#8A939B';
    if (theme.percentage >= 80) return '#2F6F5E';
    if (theme.percentage >= 50) return '#B07A1F';
    return '#A8443B';
  }

  get evidenceCoveragePct(): number {
    if (!this.dashboard || this.dashboard.evaluatedItems === 0) return 0;
    return Math.round((this.dashboard.evaluatedItemsWithEvidenceCount / this.dashboard.evaluatedItems) * 100);
  }

  evidenceColor(): string {
    const pct = this.evidenceCoveragePct;
    if (pct >= 70) return '#2F6F5E';
    if (pct >= 40) return '#B07A1F';
    return '#A8443B';
  }

  // Igual que la app móvil: el tile "Sin evaluar" muestra pendingItems.length (tope 8 puesto
  // por el backend), NO el total real de "Pendiente" en maturityCounts — que sí se ve completo
  // en la leyenda del anillo. Queda así a propósito para no divergir entre plataformas; si se
  // quiere el total real, cambiar a legendCount('Pendiente').
  get pendingTileCount(): number {
    return this.dashboard?.pendingItems.length || 0;
  }

  get visiblePendingItems(): PendingItem[] {
    return (this.dashboard?.pendingItems || []).slice(0, 5);
  }

  // Ancho de cada segmento proporcional al conteo crudo (flex), no normalizado a %, igual que
  // Expanded(flex: s.count) en la app móvil.
  severityWidthPct(s: BreachSeverity): number {
    if (!this.dashboard) return 0;
    const total = this.dashboard.breachSeverityBreakdown.reduce((sum, x) => sum + x.count, 0);
    return total > 0 ? (s.count / total) * 100 : 0;
  }

  trackByTheme(_index: number, t: DashboardTheme): string {
    return t.theme;
  }

  trackByPendingItem(_index: number, p: PendingItem): string {
    return p.tipo + ':' + p.itemId;
  }

}
