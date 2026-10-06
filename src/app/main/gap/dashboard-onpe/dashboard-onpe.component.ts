import { Component, OnInit } from '@angular/core';
import { GapDashboardService } from 'app/services/gap-dashboard.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Evaluation } from 'app/models/evaluation';
import { Standard } from 'app/models/standard';
import { GapStats } from 'app/main/gap/gap-breach-map/gap-breach-map.component';

interface DashboardOnpeGroup {
  grupo: string;
  actual: number;
  meta: number;
  actualPercent: number;
}

interface DashboardOnpeControl {
  grupo: string;
  code: string;
  name: string;
  // null = todavía sin evaluar ("Pendiente") -- mismo campo que devuelve el backend, no se
  // recalcula acá (a diferencia de "grupos", donde un pendiente cuenta como 0 en el promedio).
  madurez: number | null;
  madurezColor: string | null;
  // "Gestionado" / "Definido" / "No aplicable" / "Pendiente" -- nombre del nivel, ya resuelto
  // por el backend (mismo texto que usa soa-report para "implementacion").
  nivel: string;
  isNotApplicable: boolean;
}

interface DashboardOnpeThemeGroup {
  theme: string;
  items: DashboardOnpeControl[];
  // Precalculados una sola vez en buildDerivedData() -- ver el comentario ahí de por qué no son
  // un getter/método llamado desde el template.
  radarData: any[];
  radarColorScheme: any;
}

interface DonutSegment {
  name: string;
  value: number;
  color: string;
  dasharray: string;
  dashoffset: number;
}

const COLOR_MUTED = '#6B7480';

// Radio/circunferencia del anillo SVG -- mismo cálculo que .hd__donut en home-dashboard, para
// que el trazo de cada segmento (dasharray/dashoffset) se arme igual en las dos pantallas.
const DONUT_RADIUS = 50;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

// Color (paleta de tema Vuexy) + ícono feather + hex por grupo, en el mismo orden en que el
// backend ya los devuelve (por groupNumber ascendente: Organizacionales/Personas/Físicos/
// Tecnológicos). No se mapean por nombre para no depender de que el texto calce exacto. El hex
// es el mismo que resuelven las variables $warning/$info/$success/$primary del tema
// (_variables.scss) -- se necesita literal para el trazo del SVG, que no puede tomar una clase
// bg-*/text-* como el resto de la pantalla.
const GROUP_STYLES: { color: string; icon: string; hex: string }[] = [
  { color: 'warning', icon: 'briefcase', hex: '#ff9f43' },  // Controles Organizacionales
  { color: 'info', icon: 'users', hex: '#00cfe8' },         // Controles de Personas
  { color: 'success', icon: 'home', hex: '#28c76f' },       // Controles Físicos
  { color: 'primary', icon: 'cpu', hex: '#2971b9' },        // Controles Tecnológicos
];

/**
 * Dashboard de madurez estilo ONPE — replica la hoja "Dashboard" del Excel
 * "FM03-GPP_GC Declaración de aplicabilidad del SGSI (SoA)" en dos pestañas (todo junto se ve
 * sobrecargado): "Resumen" (cuadro de Madurez General + dona con los 4 grupos + detalle control
 * por control) y "Radares" (los 5 radares de la hoja original -- 1 por grupo + 1 comparando los
 * 4 grupos entre sí), reutilizando <app-radar-chart> (mismo componente que ya usan
 * maturity-radar y evaluation-process/dashboard).
 * Carga con GET /api/gapDashboard/dashboard-onpe.
 */
@Component({
  selector: 'app-dashboard-onpe',
  templateUrl: './dashboard-onpe.component.html',
  styleUrls: ['./dashboard-onpe.component.scss']
})
export class DashboardOnpeComponent implements OnInit {

  loading = true;
  errorMessage = '';

  hasCurrentEvaluation = true;
  evaluationId: number | null = null;
  standardName = '';
  evaluationDescription = '';
  madurezGeneral = 0;
  madurezGeneralPercent = 0;
  grupos: DashboardOnpeGroup[] = [];
  controles: DashboardOnpeControl[] = [];

  // Todo lo de acá abajo se arma UNA sola vez por carga (en buildDerivedData(), llamado desde
  // load()) en vez de ser un getter o un método invocado desde el template -- un getter/método
  // que arma un array/objeto nuevo (.map(), object literal) se vuelve a evaluar en cada ciclo de
  // detección de cambios de Angular (¡cualquier scroll, no solo cambios de datos reales!), así
  // que cada vez devuelve una referencia distinta aunque el contenido sea idéntico. Angular
  // compara @Input por referencia: <app-radar-chart> (y <app-gap-breach-map>) veían eso como
  // "cambió la data" en cada ciclo y volvían a redibujar/reanimar el gráfico entero -- por eso
  // el radar "parpadeaba" con cada scroll.
  headerEvaluation: Evaluation = new Evaluation();
  headerStats: GapStats = { pct: 0, evaluados: 0, total: 0 };
  donutSegments: DonutSegment[] = [];
  groupedControles: DashboardOnpeThemeGroup[] = [];
  radarGeneralData: any[] = [];

  contentHeader: object;

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
          { name: 'Dashboard ONPE', isLink: false },
        ]
      }
    };
  }

  load() {
    this.loading = true;
    this.errorMessage = '';
    this._gapDashboardService.getDashboardOnpe().subscribe((res: any) => {
      this.hasCurrentEvaluation = !!res.hasCurrentEvaluation;
      this.evaluationId = res.evaluationId ?? null;
      this.standardName = res.standardName || '';
      this.evaluationDescription = res.evaluationDescription || '';
      this.madurezGeneral = res.madurezGeneral || 0;
      this.madurezGeneralPercent = res.madurezGeneralPercent || 0;
      this.grupos = res.grupos || [];
      this.controles = res.controles || [];
      this.buildDerivedData();
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errorMessage = 'No se pudo cargar el dashboard. Intenta de nuevo.';
      ErrorManager.handleError(error);
    });
  }

  percentLabel(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  // Arma de una vez todo lo derivado que antes eran getters/métodos llamados desde el template
  // (header, dona, agrupado por tema, radares) -- ver el comentario junto a las propiedades más
  // arriba para el motivo (evitar que Angular vea "datos nuevos" en cada ciclo de detección de
  // cambios y redibuje/reanime los gráficos hijos con cada scroll).
  private buildDerivedData(): void {
    // Header "Análisis de brechas" (app-gap-breach-map, showThemeMap=false: acá solo sirve para
    // identificar de qué evaluación es este dashboard, la tarjeta "Mapa de brecha por tema" que
    // trae ese componente duplicaría el detalle por control que ya tiene la pestaña "Resumen").
    // El % que muestra es el mismo "Madurez General" de la tarjeta de abajo (no el % de
    // cumplimiento de Análisis de Brechas, que cuenta también las cláusulas 4-10 -- acá el
    // alcance es solo Anexo A, mostrar un número con otra fórmula y otro alcance bajo el mismo
    // rótulo hubiera confundido más que ayudado).
    const standard = new Standard(undefined, this.standardName);
    this.headerEvaluation = new Evaluation(
      this.evaluationId ?? undefined, undefined, undefined, this.evaluationDescription, undefined, standard);

    const evaluados = this.controles.filter(c => !c.isNotApplicable && c.madurez !== null && c.madurez !== undefined).length;
    this.headerStats = { pct: Math.round(this.madurezGeneralPercent * 100), evaluados, total: this.controles.length };

    // Dona "Madurez General" (chart4 del Excel): un segmento por grupo, del tamaño de su
    // "Actual" (no partes iguales -- un doughnut de Excel es proporcional al valor, y acá igual).
    // El "2.96" del centro es Madurez General, no la suma de los 4 valores (ver
    // GetDashboardONPEQuery), así que va como texto superpuesto aparte, no como un valor que
    // ngx-charts calcule solo -- mismo truco de anillo SVG + label centrado que ya usa
    // home-dashboard.component.ts.
    const total = this.grupos.reduce((sum, g) => sum + g.actual, 0);
    const segments: DonutSegment[] = [];
    if (total > 0) {
      let offset = 0;
      this.grupos.forEach((g, i) => {
        if (g.actual <= 0) return;
        const length = (g.actual / total) * DONUT_CIRCUMFERENCE;
        segments.push({
          name: g.grupo,
          value: g.actual,
          color: this.groupHex(i),
          dasharray: `${length} ${DONUT_CIRCUMFERENCE - length}`,
          dashoffset: -offset,
        });
        offset += length;
      });
    }
    this.donutSegments = segments;

    // Agrupa manteniendo el orden en que ya vienen (el backend los ordena por
    // groupNumber/código), sin volver a ordenar acá -- mismo criterio que groupedControls en
    // soa-report.component.ts. De paso arma "código - nombre" completo por control (el "name"
    // que usa el eje del radar) y el colorScheme de ese grupo -- un radar por grupo (chart1/2/3/5
    // del Excel). La etiqueta visible del eje se recorta igual a 10 caracteres (default de
    // <app-radar-chart>, ngx-charts no wrappea texto largo con 8-37 ejes), pero el nombre
    // completo queda disponible en el tooltip nativo al pasar el mouse. Pendientes cuentan como
    // 0 en el gráfico, mismo criterio que el promedio de "grupos" (ver GetDashboardONPEQuery) --
    // no se excluyen ni dejan un hueco sin explicar en el radar.
    const groups: DashboardOnpeThemeGroup[] = [];
    const byTheme = new Map<string, DashboardOnpeThemeGroup>();
    for (const c of this.controles) {
      let group = byTheme.get(c.grupo);
      if (!group) {
        group = { theme: c.grupo, items: [], radarData: [], radarColorScheme: null };
        byTheme.set(c.grupo, group);
        groups.push(group);
      }
      group.items.push(c);
    }
    for (const group of groups) {
      group.radarData = [{
        name: group.theme,
        series: group.items.map(c => ({ name: `${c.code} - ${c.name}`, value: c.madurez ?? 0 })),
      }];
      group.radarColorScheme = this.radarColorSchemeForTheme(group.theme);
    }
    this.groupedControles = groups;

    // Radar de los 4 grupos (chart6 del Excel) -- forma que espera <app-radar-chart> (ngx-charts
    // polar, multi-series): una sola serie "Actual" con un eje por grupo.
    this.radarGeneralData = [{
      name: 'Actual',
      series: this.grupos.map(g => ({ name: g.grupo, value: g.actual })),
    }];
  }

  groupColor(index: number): string {
    return GROUP_STYLES[index % GROUP_STYLES.length].color;
  }

  groupIcon(index: number): string {
    return GROUP_STYLES[index % GROUP_STYLES.length].icon;
  }

  groupHex(index: number): string {
    return GROUP_STYLES[index % GROUP_STYLES.length].hex;
  }

  // Encuentra el color del grupo (mismo orden/colores que la tabla resumen de arriba) a partir
  // del nombre de tema -- así la franja de cada área en el detalle usa el mismo color que su
  // fila en "grupos", en vez de una paleta aparte.
  themeColor(theme: string): string {
    const index = this.grupos.findIndex(g => g.grupo === theme);
    return this.groupColor(index < 0 ? 0 : index);
  }

  trackByGrupo(_index: number, g: DashboardOnpeGroup): string {
    return g.grupo;
  }

  // El número (0-5) va en el badge circular; "Pendiente"/"No aplicable"/"Gestionado" etc. van
  // aparte como texto -- si no hay nota numérica todavía, el badge muestra "—" en vez de un
  // número que no existe.
  madurezNumberLabel(c: DashboardOnpeControl): string {
    return c.madurez === null || c.madurez === undefined ? '—' : `${c.madurez}`;
  }

  madurezColor(c: DashboardOnpeControl): string {
    if (c.isNotApplicable || c.madurez === null || c.madurez === undefined) return COLOR_MUTED;
    return c.madurezColor || COLOR_MUTED;
  }

  // Mismo criterio que soa-report.component.ts: fondo tenue (12% de opacidad) del color del
  // nivel de madurez, texto en el color sólido -- no una paleta de badges nueva por pantalla.
  pillBackground(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }

  trackByCode(_index: number, c: DashboardOnpeControl): string {
    return c.code;
  }

  trackByTheme(_index: number, group: DashboardOnpeThemeGroup): string {
    return group.theme;
  }

  radarGeneralColorScheme = { domain: ['#2971b9'], group: 'Ordinal', selectable: true, name: 'General' };

  // Colores del radar de un grupo -- llamado una sola vez por grupo desde buildDerivedData(), no
  // desde el template (ver el comentario junto a las propiedades de arriba).
  private radarColorSchemeForTheme(theme: string): any {
    const index = this.grupos.findIndex(g => g.grupo === theme);
    return { domain: [this.groupHex(index < 0 ? 0 : index)], group: 'Ordinal', selectable: true, name: theme };
  }

}
