import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { GapHomeComponent } from './gap-home.component';
import { GapService } from 'app/services/gap.service';

// Mock del resumen (GET /api/gap/resumen) — mismos campos que consume loadResumen().
const mockResumen = {
  evaluation: { evaluationId: 1, standardId: 10, description: 'Evaluación - Agosto 2026' },
  maturityLevels: [{ maturityLevelId: 1, name: 'No implementado', color: '#A8443B', value: 0 }],
  responsibles: [{ responsibleId: 1, name: 'Gina Meza' }],
  temas: ['Todos', 'Cláusulas', 'Políticas relacionadas con la IA'],
  temaRows: [{ theme: 'Políticas relacionadas con la IA', total: 3, evaluados: 3, pendiente: 0, segments: [] }],
  stats: { pct: 33, evaluados: 3, total: 81 },
  evidencias: 2,
  legend: [{ name: 'No implementado', color: '#A8443B', count: 1 }],
};

// Mock de una página de ítems (GET /api/gap/items) — DTO plano tal como lo arma GetGapItemsQuery.
function mockItemsPage(codes: string[], totalRows: number) {
  return {
    data: codes.map((code, i) => ({
      tipo: 'control',
      itemId: i + 1,
      evaluationItemId: i + 1,
      code,
      name: `Control ${code}`,
      theme: 'Políticas relacionadas con la IA',
      maturityLevelId: 1,
      value: 0,
      hasEvidence: false,
    })),
    pagination: { totalRows },
  };
}

describe('GapHomeComponent', () => {
  let component: GapHomeComponent;
  let fixture: ComponentFixture<GapHomeComponent>;
  let gapServiceSpy: jasmine.SpyObj<GapService>;

  beforeEach(async () => {
    gapServiceSpy = jasmine.createSpyObj('GapService', ['getResumen', 'getItems']);
    gapServiceSpy.getResumen.and.returnValue(of(mockResumen));
    gapServiceSpy.getItems.and.returnValue(of(mockItemsPage(['2.1', '2.2'], 2)));

    await TestBed.configureTestingModule({
      declarations: [GapHomeComponent],
      providers: [{ provide: GapService, useValue: gapServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GapHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga el resumen (header/mapa por tema) con scopeToUser=false, no acotado al usuario', () => {
    fixture.detectChanges();
    expect(gapServiceSpy.getResumen).toHaveBeenCalledWith(false);
    expect(component.evaluation).toEqual(mockResumen.evaluation as any);
    expect(component.stats).toEqual(mockResumen.stats);
    expect(component.temaRows.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('carga la primera página de ítems al iniciar y arma pageItems desde el DTO plano', () => {
    fixture.detectChanges();
    expect(gapServiceSpy.getItems).toHaveBeenCalledWith(0, 30, '', 'Todos', false);
    expect(component.pageItems.length).toBe(2);
    expect(component.pageItems[0].tipo).toBe('control');
    // hasMore = pageItems.length < totalRows -- acá 2/2, ya no hay más páginas.
    expect(component.hasMore).toBeFalse();
  });

  it('loadItems(false) acumula la página nueva al final en vez de reemplazar pageItems', () => {
    gapServiceSpy.getItems.and.returnValue(of(mockItemsPage(['2.1'], 4)));
    fixture.detectChanges(); // primera página: 1 ítem, hasMore=true (1 < 4)
    expect(component.pageItems.length).toBe(1);
    expect(component.hasMore).toBeTrue();

    gapServiceSpy.getItems.and.returnValue(of(mockItemsPage(['2.2'], 4)));
    component.loadItems(false); // el sentinel entró en viewport -- pide la página siguiente
    expect(component.pageItems.length).toBe(2);
    expect(gapServiceSpy.getItems).toHaveBeenCalledWith(1, 30, '', 'Todos', false);
  });

  // Regresión: filterChange$ NO usa distinctUntilChanged() a propósito (ver el comentario en
  // ngOnInit) -- antes de ese fix, el segundo cambio consecutivo de búsqueda quedaba sin
  // efecto porque Subject<void> emite "undefined" siempre y distinctUntilChanged() los trataba
  // como iguales después del primero.
  it('dos cambios de búsqueda seguidos disparan loadItems las dos veces (no solo el primero)', fakeAsync(() => {
    fixture.detectChanges();
    gapServiceSpy.getItems.calls.reset();

    component.searchText = 'politica';
    tick(300);
    expect(gapServiceSpy.getItems).toHaveBeenCalledTimes(1);
    expect(gapServiceSpy.getItems).toHaveBeenCalledWith(0, 30, 'politica', 'Todos', false);

    component.searchText = 'evidencia';
    tick(300);
    expect(gapServiceSpy.getItems).toHaveBeenCalledTimes(2);
    expect(gapServiceSpy.getItems).toHaveBeenCalledWith(0, 30, 'evidencia', 'Todos', false);
  }));

  it('cambiar el filtro de tema resetea skip/pageItems y vuelve a pedir desde el principio', fakeAsync(() => {
    fixture.detectChanges();
    gapServiceSpy.getItems.and.returnValue(of(mockItemsPage(['5.1'], 1)));
    gapServiceSpy.getItems.calls.reset();

    component.filtroTema = 'Controles Organizacionales';
    tick(300);

    expect(gapServiceSpy.getItems).toHaveBeenCalledWith(0, 30, '', 'Controles Organizacionales', false);
    expect(component.pageItems.length).toBe(1);
  }));

  it('onUpdate() vuelve a pedir el resumen pero no la lista ya cargada', () => {
    fixture.detectChanges();
    gapServiceSpy.getResumen.calls.reset();
    gapServiceSpy.getItems.calls.reset();

    component.onUpdate();

    expect(gapServiceSpy.getResumen).toHaveBeenCalledTimes(1);
    expect(gapServiceSpy.getItems).not.toHaveBeenCalled();
  });

  it('ngOnDestroy no revienta si nunca se llegó a enganchar el IntersectionObserver', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
