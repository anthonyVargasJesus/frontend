import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

interface RadarAxisLabel {
  x: number;
  y: number;
  width: number;
  align: 'left' | 'right' | 'center';
  text: string;
}

interface RadarPoint {
  x: number;
  y: number;
  name: string;
  value: number;
}

interface RadarSeriesShape {
  name: string;
  color: string;
  points: string; // "x,y x,y ..." para <polygon>
  markers: RadarPoint[];
}

// Mismo 0-5 fijo que la escala de "Nivel de madurez" del Excel de ONPE -- a diferencia de
// <ngx-charts-polar-chart>, que autoescala al valor más alto de cada serie (un grupo con máximo
// 4 se veía "tan lleno" como uno con máximo 5, sin ser comparables entre sí a simple vista).
const RADAR_MAX_VALUE = 5;

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent implements OnInit, OnDestroy {

  @Input()
  multi: any[];

  @Input()
  colorScheme: any;

  // Pass-through a ngx-charts-polar-chart (solo aplica cuando wrapLabels=false), con el mismo
  // default que trae la librería (recorta etiquetas de más de 10 caracteres con "...") para no
  // cambiar el comportamiento de las pantallas que ya usan este componente (maturity-radar,
  // evaluation-process/dashboard).
  @Input()
  labelTrim = true;

  @Input()
  labelTrimSize = 10;

  // Cuando hay muchos ejes con nombres largos (los radares por grupo del dashboard ONPE: 8-37
  // controles), <ngx-charts-polar-chart> no da abasto: labelTrim corta por cantidad de
  // caracteres (no por espacio real disponible), y sin trim el texto se dibuja fuera del área
  // del SVG y desaparece por completo (la librería no wrappea texto a varias líneas como sí hace
  // Excel). wrapLabels=true cambia a un renderer propio (mismo <multi>/<colorScheme> de entrada,
  // pero SVG + divs HTML para las etiquetas, que sí wrappean texto con CSS normal en vez de
  // pelear con esas limitaciones). Default false: no cambia nada en las pantallas que ya andaban
  // bien con pocos ejes (maturity-radar, evaluation-process/dashboard).
  @Input()
  wrapLabels = false;

  view: any[] = [1000, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  // yAxis (números 0-5 del anillo) queda apagado a propósito en la rama de ngx-charts -- ver el
  // comentario en radar-chart.component.html, romper las etiquetas de categoría con muchos ejes
  // es peor que no tener la escala numérica. La rama wrapLabels sí trae su propia escala
  // (radarScaleTicks más abajo), sin ese conflicto.
  yAxis: boolean = false;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';

  coreConfig: any;
  private _unsubscribeAll: Subject<any>;
  // Ancho/alto real de la tarjeta (no "window.innerWidth / 3" fijo) -- un ResizeObserver sobre el
  // host mide el ancho real, y se ajusta también si se colapsa el sidebar o se activa una
  // pestaña ngbNav, no solo con el resize de la ventana.
  // "any": el lib.dom.d.ts de TypeScript 4.1 (versión de este proyecto) todavía no trae los
  // tipos de ResizeObserver (recién en TS 4.4) -- el objeto sí existe en el navegador en tiempo
  // de ejecución, solo falta la definición de tipos acá.
  private _resizeObserver?: any;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _elementRef: ElementRef<HTMLElement>) {
    this._unsubscribeAll = new Subject();
  }

  // Escucha cambios en el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setViewSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setViewSize();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    const resizeObserverCtor = (window as any).ResizeObserver;
    if (typeof resizeObserverCtor !== 'undefined') {
      this._resizeObserver = new resizeObserverCtor(() => this.setViewSize());
      this._resizeObserver.observe(this._elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._resizeObserver?.disconnect();
  }

  private setViewSize() {
    // offsetWidth da 0 mientras el host todavía no tiene layout (ej. recién creado dentro de una
    // pestaña ngbNav que aún no terminó de activarse) -- ahí se usa el mismo fallback de antes en
    // vez de dejar el gráfico en 0px; el ResizeObserver corrige el tamaño apenas el navegador
    // calcula el layout real.
    const hostWidth = this._elementRef.nativeElement.offsetWidth;
    const width = hostWidth > 0 ? hostWidth : window.innerWidth / 3;
    // La altura escala junto con el ancho (piso 320, techo 700): ngx-charts-polar-chart (y
    // nuestro propio renderer) calculan el radio como función del lado más chico entre ancho y
    // alto, así que una altura fija topaba el radio sin importar cuánto ancho hubiera disponible.
    const height = Math.max(320, Math.min(width, 700));
    this.view = [width, height];
  }

  onSelect(event) {

  }

  // ================= Renderer propio (wrapLabels=true) =================
  // Geometría pura, sin d3 ni depender de internals de ngx-charts: un polígono por serie sobre N
  // ejes distribuidos en círculo, empezando arriba (ángulo 0) y en sentido horario -- misma
  // convención que usa ngx-charts-polar-chart (y el Excel de referencia). Se recalcula en cada
  // change detection, mismo criterio que otros getters derivados de este mismo proyecto -- si
  // esto llega a pesar en pantallas con muchos radares a la vez, conviene memoizar por
  // multi/colorScheme igual que se hizo en dashboard-onpe.component.ts.

  private get size(): number {
    return Math.min(this.view[0], this.view[1]);
  }

  private get center(): { x: number; y: number } {
    return { x: this.view[0] / 2, y: this.view[1] / 2 };
  }

  private get plotRadius(): number {
    return (this.size / 2) * 0.55;
  }

  private get labelRadius(): number {
    return (this.size / 2) * 0.66;
  }

  // Ancho de la caja de cada etiqueta -- depende de cuántos ejes hay, no solo del tamaño del
  // gráfico: con más ejes hay menos espacio angular entre uno y el siguiente (34 ejes = ~10.6°
  // cada uno), así que una caja ancha fija los hace pisarse entre sí sin importar cuánto crezca
  // el círculo. Con pocos ejes (4-8) el tope de 150px evita una caja innecesariamente ancha.
  get labelWidth(): number {
    const total = this.axisNames.length || 1;
    return Math.max(55, Math.min(150, (this.size * 3) / total));
  }

  get viewBox(): string {
    return `0 0 ${this.view[0]} ${this.view[1]}`;
  }

  // Nombres únicos en el orden en que aparecen (para nuestro caso siempre 1 sola serie, así que
  // esto es directamente el orden de esa serie -- ya viene ordenado por el backend).
  private get axisNames(): string[] {
    if (!this.multi?.length) return [];
    const names: string[] = [];
    for (const s of this.multi) {
      for (const d of s.series || []) {
        if (!names.includes(d.name)) names.push(d.name);
      }
    }
    return names;
  }

  private angleFor(index: number, total: number): number {
    return total > 0 ? (index / total) * 2 * Math.PI : 0;
  }

  private pointAt(angle: number, radius: number): { x: number; y: number } {
    const c = this.center;
    return { x: c.x + radius * Math.sin(angle), y: c.y - radius * Math.cos(angle) };
  }

  get radarAxes(): RadarAxisLabel[] {
    const names = this.axisNames;
    const total = names.length;
    return names.map((name, i) => {
      const angle = this.angleFor(i, total);
      const pos = this.pointAt(angle, this.labelRadius);
      const sin = Math.sin(angle);
      let align: 'left' | 'right' | 'center' = 'center';
      let x = pos.x - this.labelWidth / 2;
      if (sin > 0.15) {
        align = 'left';
        x = pos.x;
      } else if (sin < -0.15) {
        align = 'right';
        x = pos.x - this.labelWidth;
      }
      return { x, y: pos.y, width: this.labelWidth, align, text: name };
    });
  }

  get radarSpokes(): string[] {
    const total = this.axisNames.length;
    const c = this.center;
    const lines: string[] = [];
    for (let i = 0; i < total; i++) {
      const p = this.pointAt(this.angleFor(i, total), this.plotRadius);
      lines.push(`M${c.x},${c.y} L${p.x},${p.y}`);
    }
    return lines;
  }

  // 5 anillos concéntricos (valores 1 a 5) -- un polígono de N lados por anillo (lados rectos
  // entre eje y eje), no un círculo perfecto, igual que dibuja un radar chart real.
  get radarGridRings(): string[] {
    const total = this.axisNames.length;
    if (total < 3) return [];
    const rings: string[] = [];
    for (let ring = 1; ring <= RADAR_MAX_VALUE; ring++) {
      const r = (ring / RADAR_MAX_VALUE) * this.plotRadius;
      const points: string[] = [];
      for (let i = 0; i < total; i++) {
        const p = this.pointAt(this.angleFor(i, total), r);
        points.push(`${p.x},${p.y}`);
      }
      rings.push(points.join(' '));
    }
    return rings;
  }

  // Números 0-5 sobre el eje de arriba (ángulo 0) -- lo mismo que se intentó con [yAxis] de
  // ngx-charts y se tuvo que revertir por romper las etiquetas de categoría; acá no compite con
  // nada porque las etiquetas de eje son un renderer aparte, así que sí se puede mostrar la
  // escala.
  get radarScaleTicks(): { y: number; label: string }[] {
    const c = this.center;
    const ticks: { y: number; label: string }[] = [];
    for (let v = 0; v <= RADAR_MAX_VALUE; v++) {
      ticks.push({ y: c.y - (v / RADAR_MAX_VALUE) * this.plotRadius, label: `${v}` });
    }
    return ticks;
  }

  get radarSeries(): RadarSeriesShape[] {
    if (!this.multi?.length) return [];
    const names = this.axisNames;
    const total = names.length;
    const domain: string[] = (this.colorScheme && this.colorScheme.domain) || ['#2971b9'];
    return this.multi.map((s, seriesIndex) => {
      const color = domain[seriesIndex % domain.length];
      const markers: RadarPoint[] = (s.series || []).map((d: any) => {
        const i = names.indexOf(d.name);
        const value = Math.max(0, Math.min(RADAR_MAX_VALUE, d.value ?? 0));
        const r = (value / RADAR_MAX_VALUE) * this.plotRadius;
        const pos = this.pointAt(this.angleFor(i, total), r);
        return { x: pos.x, y: pos.y, name: d.name, value: d.value ?? 0 };
      });
      return {
        name: s.name,
        color,
        points: markers.map(m => `${m.x},${m.y}`).join(' '),
        markers,
      };
    });
  }

}
