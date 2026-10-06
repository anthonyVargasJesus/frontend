import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { PlanDeAccionComponent } from './plan-de-accion.component';
import { GapService } from 'app/services/gap.service';
import { ActionPlanService } from 'app/services/action-plan.service';

// Catálogo de 7 niveles CMM real -- solo 4 generan brecha (Optimizado/Gestionado/No aplicable
// no son no-conformidad). Mismo catálogo real usado para validar breachGeneratingLevels.
const maturityLevels = [
  { maturityLevelId: 1, name: 'No implementado', color: '#A8443B', value: 0, generatesBreach: true },
  { maturityLevelId: 2, name: 'Inicial', color: '#FF9F43', value: 1, generatesBreach: true },
  { maturityLevelId: 3, name: 'Repetible', color: '#E8C547', value: 2, generatesBreach: true },
  { maturityLevelId: 4, name: 'Definido', color: '#8BC34A', value: 3, generatesBreach: true },
  { maturityLevelId: 5, name: 'Gestionado', color: '#28C76F', value: 4, generatesBreach: false },
  { maturityLevelId: 6, name: 'Optimizado', color: '#2F6F5E', value: 5, generatesBreach: false },
  { maturityLevelId: 7, name: 'No aplicable', color: '#6B7480', value: 0, generatesBreach: false },
];

const mockBootstrap = {
  evaluation: { evaluationId: 1, standardId: 10, description: 'Evaluación - Agosto 2026' },
  // Orden real del backend: requisitos (Cláusulas) primero, luego controles por grupo -- ver
  // CollectRequirementItems/CollectControlItems en GetPlanDeAccionBootstrapQuery.
  items: [
    { tipo: 'requisito', itemId: 40, maturityLevelId: 1, theme: 'Cláusulas', evaluationItemId: 503 },
    { tipo: 'control', itemId: 21, maturityLevelId: 1, theme: 'Políticas relacionadas con la IA', evaluationItemId: 501 },
    { tipo: 'control', itemId: 22, maturityLevelId: 4, theme: 'Políticas relacionadas con la IA', evaluationItemId: 502 },
  ],
  maturityLevels,
  breaches: [
    { breachId: 100, type: '2', controlId: 21, requirementId: 0, numerationToShow: '2.1', title: 'El control 2.1 no se cumple' },
    { breachId: 101, type: '2', controlId: 22, requirementId: 0, numerationToShow: '2.2', title: 'El control 2.2 no se cumple' },
    { breachId: 102, type: '1', controlId: 0, requirementId: 40, numerationToShow: '4.1', title: 'El requisito 4.1 no se cumple' },
  ],
  actionPlanStatuses: [{ actionPlanStatusId: 1, name: 'Pendiente', color: '#8A939B', value: 0 }],
  actionPlanPriorities: [{ actionPlanPriorityId: 1, name: 'Alta', color: '#A8443B' }],
  users: [{ userId: 1, name: 'Gina', firstName: 'Meza' }],
};

const mockResumen = { stats: { pct: 33, evaluados: 3, total: 81 }, evidencias: 2 };
const mockCounts = { counts: [{ breachId: 100, total: 2, completed: 1 }] };

describe('PlanDeAccionComponent', () => {
  let component: PlanDeAccionComponent;
  let fixture: ComponentFixture<PlanDeAccionComponent>;
  let gapServiceSpy: jasmine.SpyObj<GapService>;
  let actionPlanServiceSpy: jasmine.SpyObj<ActionPlanService>;

  beforeEach(async () => {
    gapServiceSpy = jasmine.createSpyObj('GapService', ['getPlanDeAccionBootstrap', 'getResumen']);
    gapServiceSpy.getPlanDeAccionBootstrap.and.returnValue(of(mockBootstrap));
    gapServiceSpy.getResumen.and.returnValue(of(mockResumen));

    actionPlanServiceSpy = jasmine.createSpyObj('ActionPlanService', ['getCountsByBreach']);
    actionPlanServiceSpy.getCountsByBreach.and.returnValue(of(mockCounts));

    await TestBed.configureTestingModule({
      declarations: [PlanDeAccionComponent],
      providers: [
        { provide: GapService, useValue: gapServiceSpy },
        { provide: ActionPlanService, useValue: actionPlanServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanDeAccionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga el bootstrap (evaluación/ítems/brechas/catálogos) con scopeToUser=true', () => {
    fixture.detectChanges();
    expect(gapServiceSpy.getPlanDeAccionBootstrap).toHaveBeenCalledWith(true);
    expect(component.breaches.length).toBe(3);
    expect(component.loading).toBeFalse();
  });

  it('pide el header aparte con scopeToUser=false, el mismo % que "Cumplimiento"', () => {
    fixture.detectChanges();
    expect(gapServiceSpy.getResumen).toHaveBeenCalledWith(false);
    expect(component.headerStats.pct).toBe(33);
    expect(component.headerEvidencias).toBe(2);
  });

  it('pide los conteos de acciones por brecha una vez que conoce evaluationId', () => {
    fixture.detectChanges();
    expect(actionPlanServiceSpy.getCountsByBreach).toHaveBeenCalledWith(1);
    expect(component.countsFor(100)).toEqual({ total: 2, completed: 1 });
    // Una brecha sin acciones todavía no viene en la respuesta -- cuenta como 0/0, no undefined.
    expect(component.countsFor(101)).toEqual({ total: 0, completed: 0 });
  });

  // Regresión: los chips de filtro son dinámicos por catálogo (generatesBreach), no una lista
  // fija de 2 nombres viejos ("No cumple"/"Parcial") -- ver el comentario en breachGeneratingLevels.
  it('breachGeneratingLevels solo incluye niveles que generan brecha, ordenados por severidad', () => {
    fixture.detectChanges();
    const names = component.breachGeneratingLevels.map(l => l.name);
    expect(names).toEqual(['No implementado', 'Inicial', 'Repetible', 'Definido']);
    expect(names).not.toContain('Gestionado');
    expect(names).not.toContain('Optimizado');
    expect(names).not.toContain('No aplicable');
  });

  it('resuelve el estado de cada brecha contra el ítem correspondiente (control o requisito)', () => {
    fixture.detectChanges();
    expect(component.todasCount).toBe(3);
    expect(component.countForEstado('No implementado')).toBe(2); // brechas 100 y 102
    expect(component.countForEstado('Definido')).toBe(1); // brecha 101
  });

  it('filtra por estado sin afectar el conteo total de "Todas"', () => {
    fixture.detectChanges();
    component.filtroEstado = 'Definido';
    expect(component.rows.length).toBe(1);
    expect(component.todasCount).toBe(3); // no cambia con el filtro activo
  });

  it('agrupar por tema mete un encabezado antes de las brechas de cada tema, en el orden real', () => {
    fixture.detectChanges();
    component.groupByTheme = true;
    const rows = component.rows;
    const themeHeaders = rows.filter(r => r.kind === 'theme').map((r: any) => r.theme);
    // Cláusulas primero (orden real de "items", no alfabético -- "Cláusulas" va antes que
    // "Políticas..." aunque alfabéticamente P < C no importa acá).
    expect(themeHeaders).toEqual(['Cláusulas', 'Políticas relacionadas con la IA']);
  });

  it('ordenar por estado prioriza el nivel más grave (menor value) primero', () => {
    fixture.detectChanges();
    component.sortOption = 'estado';
    const rows = component.rows.filter(r => r.kind === 'breach') as { kind: 'breach'; resolved: any }[];
    // "No implementado" (value 0) antes que "Definido" (value 3).
    expect(rows[0].resolved.estado).toBe('No implementado');
    expect(rows[rows.length - 1].resolved.estado).toBe('Definido');
  });

  it('toggleBreach expande/colapsa y marca la brecha como visitada la primera vez', () => {
    fixture.detectChanges();
    expect(component.isExpanded(100)).toBeFalse();
    expect(component.isVisited(100)).toBeFalse();

    component.toggleBreach(100);
    expect(component.isExpanded(100)).toBeTrue();
    expect(component.isVisited(100)).toBeTrue();

    component.toggleBreach(100);
    expect(component.isExpanded(100)).toBeFalse();
    expect(component.isVisited(100)).toBeTrue(); // sigue visitada, no se desmonta
  });

  it('totals/progressPct se calculan sobre los conteos ya cargados', () => {
    fixture.detectChanges();
    expect(component.totals).toEqual({ total: 2, completed: 1 });
    expect(component.progressPct).toBe(50);
  });

  it('si falla el bootstrap, muestra un mensaje de error y no se queda cargando', () => {
    gapServiceSpy.getPlanDeAccionBootstrap.and.returnValue(
      throwError({ status: 500, statusText: 'Error' }),
    );
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('No se pudo cargar');
  });
});
