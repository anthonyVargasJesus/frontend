import { Component, Input } from '@angular/core';
import { Evaluation } from 'app/models/evaluation';
import { MaturityLevel } from 'app/models/maturity-level';

export interface ThemeRowSegment {
  name: string;
  color: string;
  count: number;
}

export interface ThemeRow {
  theme: string;
  total: number;
  evaluados: number;
  segments: ThemeRowSegment[];
  pendiente: number;
}

export interface GapStats {
  pct: number;
  evaluados: number;
  total: number;
}

/**
 * Header (% cumplimiento estimado + evaluados/con evidencia) + tarjeta "Mapa de brecha por
 * tema" — idéntico en app-gap-home y app-gap-evaluation-table (mismos datos, cero diferencia
 * de comportamiento entre las dos pantallas), así que a diferencia de la carga de ítems o el
 * guardado (que sí difieren entre tarjeta/tabla), esto sí vale la pena compartirlo en un solo
 * componente en vez de duplicar el bloque.
 */
@Component({
  selector: 'app-gap-breach-map',
  templateUrl: './gap-breach-map.component.html',
  styleUrls: ['./gap-breach-map.component.scss']
})
export class GapBreachMapComponent {

  @Input() evaluation: Evaluation = new Evaluation();
  @Input() stats: GapStats = { pct: 0, evaluados: 0, total: 0 };
  @Input() temaRows: ThemeRow[] = [];
  @Input() maturityLevels: MaturityLevel[] = [];
  @Input() totalEvidencias = 0;
  @Input() legendCounts: { [name: string]: number } = {};
  // Para pantallas que solo necesitan el header (identificar qué evaluación se está viendo,
  // ej. Plan de acción) sin la tarjeta "Mapa de brecha por tema" completa -- evita traer/calcular
  // temaRows/legend ahí donde no se usan para nada más.
  @Input() showThemeMap = true;
  // "Con evidencia" necesita datos que Plan de acción no carga (hasEvidence por ítem); se oculta
  // ese segmento del header en vez de mostrar "0 con evidencia" (dato falso, no "no disponible").
  @Input() showEvidencia = true;

  countEstado(name: string): number {
    return this.legendCounts[name] || 0;
  }

  pctClass(): string {
    if (this.stats.pct >= 70) return 'gap-home__pct--good';
    if (this.stats.pct >= 40) return 'gap-home__pct--warn';
    return 'gap-home__pct--bad';
  }

}
