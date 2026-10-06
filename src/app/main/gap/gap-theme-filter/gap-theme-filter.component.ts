import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Chips de filtro por tema ("Todos", "Cláusulas", "Controles..."). Igual que
 * app-gap-breach-map: idéntico en app-gap-home y app-gap-evaluation-table, así que va
 * compartido en vez de duplicado.
 *
 * Sin conteo evaluados/total al lado de cada chip a propósito: ya se ve en "Mapa de brecha por
 * tema" (app-gap-breach-map), justo arriba -- repetirlo acá era información duplicada en la
 * misma pantalla.
 */
@Component({
  selector: 'app-gap-theme-filter',
  templateUrl: './gap-theme-filter.component.html',
  styleUrls: ['./gap-theme-filter.component.scss']
})
export class GapThemeFilterComponent {

  @Input() temas: string[] = [];
  @Input() filtroTema = 'Todos';

  // Soporta [(filtroTema)] en el padre (convención Input/Output-con-sufijo-Change de Angular).
  @Output() filtroTemaChange = new EventEmitter<string>();

  select(tema: string) {
    this.filtroTemaChange.emit(tema);
  }

}
