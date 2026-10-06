import { Component, OnInit } from '@angular/core';
import { GapDashboardService } from 'app/services/gap-dashboard.service';
import { ErrorManager } from 'app/errors/error-manager';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

interface MaturityCount { name: string; color: string; count: number; }
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

  // Carrusel "Por área" con Swiper real (ngx-swiper-wrapper, ya venía como dependencia del
  // template sin usarse) en vez de un scroll casero -- drag de mouse, touch, paginación y
  // agrupado por página los resuelve la librería, no cálculos propios de scrollLeft/anchos.
  readonly areaSwiperConfig: SwiperConfigInterface = {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 12,
    grabCursor: true,
    watchOverflow: true,
    // Sin "el" explícito: Swiper detecta solo el <div class="swiper-pagination"> que ya está
    // dentro de este mismo .swiper-container en el HTML.
    pagination: { clickable: true },
    breakpoints: {
      480: { slidesPerView: 3, slidesPerGroup: 3 },
      700: { slidesPerView: 4, slidesPerGroup: 4 },
      960: { slidesPerView: 5, slidesPerGroup: 5 },
      1200: { slidesPerView: 6, slidesPerGroup: 6 },
    },
  };

  constructor(private _gapDashboardService: GapDashboardService) { }

  ngOnInit(): void {
    this.initContentHeader();
    this.load();
  }

  private initContentHeader() {
    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Evaluación', isLink: false, link: '#' },
          { name: 'Dashboard', isLink: false },
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

  // Segmentos del anillo en el orden que ya llega resuelto del backend (por valor de madurez
  // descendente, Pendiente al final -- ver GetGapDashboardQuery.maturityCounts), saltando los
  // que están en cero. maturityCounts ya suma totalItems (incluye Pendiente/No aplicable), así
  // que cada segmento es proporción directa sobre el total, sin recalcular nada.
  get donutSegments(): DonutSegment[] {
    if (!this.dashboard || this.dashboard.totalItems === 0) return [];
    let offset = 0;
    const segments: DonutSegment[] = [];
    for (const m of this.dashboard.maturityCounts) {
      if (m.count === 0) continue;
      const length = (m.count / this.dashboard.totalItems) * CIRCUMFERENCE;
      segments.push({
        name: m.name, count: m.count, color: m.color || '#8A939B',
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
    return (this.dashboard?.maturityCounts || []).filter(l => l.count > 0);
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

  // Total real de ítems sin evaluar (bucket "Pendiente" de maturityCounts, sin tope) -- antes
  // mostraba pendingItems.length, que es solo el preview recortado a 8 por el backend
  // (MAX_PENDING_ITEMS en GetGapDashboardQuery) para la lista de abajo, no un conteo. Con
  // evaluaciones de más de 8 pendientes el tile mentía (mostraba "8" siempre).
  get pendingTileCount(): number {
    return this.legendCount('Pendiente');
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
