import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';

import { MyActionPlansComponent } from './my-action-plans.component';
import { ActionPlanService } from 'app/services/action-plan.service';
import { LoginService } from 'app/services/login.service';
import { GapService } from 'app/services/gap.service';

const statuses = [
  { actionPlanStatusId: 1, name: 'Pendiente', color: '#8A939B', value: 0 },
  { actionPlanStatusId: 2, name: 'En curso', color: '#2971B9', value: 1 },
  { actionPlanStatusId: 3, name: 'Completado', color: '#28C76F', value: 2 },
];

const today = new Date();
const inFuture = new Date(today.getTime() + 5 * 86400000).toISOString();
const overdue = new Date(today.getTime() - 3 * 86400000).toISOString();

// Dos tareas para el MISMO control (2.2) -- el caso que reportó el usuario ("por qué sale el
// control 2.2 dos veces") y que resolvimos agrupando por brecha en vez de listar plano.
const tasks = [
  {
    actionPlanId: 1, breachId: 100, evaluationId: 1, standardId: 10, userId: 5,
    breachNumerationToShow: '2.1', breachTitle: 'El control 2.1 no se cumple: Política de IA',
    title: 'Redactar la Política de IA', startDate: today.toISOString(), dueDate: inFuture,
    actionPlanStatusId: 1, statusName: 'Pendiente', statusColor: '#8A939B',
    actionPlanPriorityId: 1, priorityName: 'Alta', priorityColor: '#A8443B',
    controlEvaluationId: 501,
  },
  {
    actionPlanId: 2, breachId: 101, evaluationId: 1, standardId: 10, userId: 5,
    breachNumerationToShow: '2.2', breachTitle: 'El control 2.2 no se cumple: Alineamiento',
    title: 'Alinear con la Política de Seguridad', startDate: today.toISOString(), dueDate: overdue,
    actionPlanStatusId: 1, statusName: 'Pendiente', statusColor: '#8A939B',
    actionPlanPriorityId: 2, priorityName: 'Media', priorityColor: '#B07A1F',
    controlEvaluationId: 502,
  },
  {
    actionPlanId: 3, breachId: 101, evaluationId: 1, standardId: 10, userId: 6,
    breachNumerationToShow: '2.2', breachTitle: 'El control 2.2 no se cumple: Alineamiento',
    title: 'Revisar la alineación con Calidad', startDate: today.toISOString(), dueDate: inFuture,
    actionPlanStatusId: 3, statusName: 'Completado', statusColor: '#28C76F',
    actionPlanPriorityId: 2, priorityName: 'Media', priorityColor: '#B07A1F',
    controlEvaluationId: 502,
  },
];

const mockResumen = {
  evaluation: { evaluationId: 1, standardId: 10, description: 'Evaluación - Agosto 2026' },
  stats: { pct: 33, evaluados: 3, total: 81 },
  evidencias: 2,
};

describe('MyActionPlansComponent', () => {
  let component: MyActionPlansComponent;
  let fixture: ComponentFixture<MyActionPlansComponent>;
  let actionPlanServiceSpy: jasmine.SpyObj<ActionPlanService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let gapServiceSpy: jasmine.SpyObj<GapService>;

  beforeEach(async () => {
    actionPlanServiceSpy = jasmine.createSpyObj('ActionPlanService', ['getMyActionsBootstrap', 'updateQuiet']);
    actionPlanServiceSpy.getMyActionsBootstrap.and.returnValue(of({ tasks, statuses }));
    actionPlanServiceSpy.updateQuiet.and.returnValue(of({} as any));

    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getCurrentUser']);
    loginServiceSpy.getCurrentUser.and.returnValue({ em: 'gina.meza@onpe.gob.pe' } as any);

    gapServiceSpy = jasmine.createSpyObj('GapService', ['getResumen']);
    gapServiceSpy.getResumen.and.returnValue(of(mockResumen));

    await TestBed.configureTestingModule({
      declarations: [MyActionPlansComponent],
      providers: [
        { provide: ActionPlanService, useValue: actionPlanServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: GapService, useValue: gapServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MyActionPlansComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('toma el email del usuario logeado y carga sus tareas', () => {
    fixture.detectChanges();
    expect(component.userEmail).toBe('gina.meza@onpe.gob.pe');
    expect(actionPlanServiceSpy.getMyActionsBootstrap).toHaveBeenCalled();
    expect(component.tasks.length).toBe(3);
    expect(component.loading).toBeFalse();
  });

  it('pide el header aparte con scopeToUser=false', () => {
    fixture.detectChanges();
    expect(gapServiceSpy.getResumen).toHaveBeenCalledWith(false);
    expect(component.headerStats.pct).toBe(33);
  });

  // Regresión: "por qué sale el control 2.2 dos veces" -- antes cada tarea era su propia fila
  // plana repitiendo el título del control; ahora una brecha con varias acciones sale UNA vez
  // como encabezado, con sus tareas agrupadas debajo.
  it('agrupa varias tareas del mismo control bajo un solo encabezado, no repetido', () => {
    fixture.detectChanges();
    const rows = component.rows;
    const breachHeaders = rows.filter(r => r.kind === 'breach') as { kind: 'breach'; breachId: number; count: number }[];

    expect(breachHeaders.length).toBe(2); // 2.1 y 2.2, no 3 (una por tarea)
    const header22 = breachHeaders.find(h => h.breachId === 101)!;
    expect(header22.count).toBe(2); // las 2 tareas del control 2.2 agrupadas

    // Cada tarea sigue siendo su propia fila (con su propio estado), solo el encabezado del
    // control no se repite.
    const taskRows = rows.filter(r => r.kind === 'task');
    expect(taskRows.length).toBe(3);
  });

  it('statusFilters solo lista estados del catálogo con al menos una tarea, ordenados por severidad', () => {
    fixture.detectChanges();
    const filters = component.statusFilters;
    expect(filters.map(f => f.name)).toEqual(['Pendiente', 'Completado']); // "En curso" no tiene tareas
    expect(filters.find(f => f.name === 'Pendiente')!.count).toBe(2);
    expect(filters.find(f => f.name === 'Completado')!.count).toBe(1);
  });

  it('isCompleted usa el estado de mayor "value" del catálogo, no un id fijo', () => {
    fixture.detectChanges();
    expect(component.isCompleted(tasks[2] as any)).toBeTrue(); // Completado, value 2 (el más alto)
    expect(component.isCompleted(tasks[0] as any)).toBeFalse();
    expect(component.totals).toEqual({ total: 3, completed: 1 });
    expect(component.progressPct).toBe(33);
  });

  it('una tarea completada no se marca como vencida aunque la fecha ya haya pasado', () => {
    fixture.detectChanges();
    // tasks[1]: Pendiente, dueDate en el pasado -> vencida.
    expect(component.isOverdue(tasks[1] as any)).toBeTrue();
    // tasks[2]: mismo control, pero Completada -- si tuviera fecha pasada no debería marcarse.
    const completedOverdue = { ...tasks[2], dueDate: overdue } as any;
    expect(component.isOverdue(completedOverdue)).toBeFalse();
  });

  it('setStatus aplica el cambio de inmediato, antes de que el backend confirme (optimista)', () => {
    fixture.detectChanges();
    const task = { ...tasks[0] } as any;
    const pending = new Subject<any>();
    actionPlanServiceSpy.updateQuiet.and.returnValue(pending.asObservable());

    component.setStatus(task, 2); // Pendiente -> En curso

    // Todavía no respondió el backend (el Subject sigue abierto) y ya se ve el cambio.
    expect(task.actionPlanStatusId).toBe(2);
    expect(task.statusName).toBe('En curso');
    expect(component.isSaving(task.actionPlanId)).toBeTrue();

    pending.next({});
    expect(component.isSaving(task.actionPlanId)).toBeFalse();
  });

  it('setStatus revierte el cambio optimista si el guardado falla', () => {
    fixture.detectChanges();
    const task = { ...tasks[0] } as any;
    actionPlanServiceSpy.updateQuiet.and.returnValue(throwError({ status: 500, statusText: 'Error' }));

    component.setStatus(task, 2); // Pendiente -> En curso, falla, revierte

    expect(task.actionPlanStatusId).toBe(1);
    expect(task.statusName).toBe('Pendiente');
    expect(component.isSaving(task.actionPlanId)).toBeFalse();
  });

  it('setStatus no llama al backend si el estado no cambió', () => {
    fixture.detectChanges();
    const task = { ...tasks[0] } as any;
    component.setStatus(task, task.actionPlanStatusId);
    expect(actionPlanServiceSpy.updateQuiet).not.toHaveBeenCalled();
  });

  it('ordenar por prioridad usa el rank real (Alta antes que Media), no alfabético', () => {
    fixture.detectChanges();
    component.sortOption = 'prioridad';
    const taskRows = component.rows.filter(r => r.kind === 'task') as { kind: 'task'; task: any }[];
    expect(taskRows[0].task.priorityName).toBe('Alta');
  });

  it('si falla la carga, muestra un mensaje de error', () => {
    actionPlanServiceSpy.getMyActionsBootstrap.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('No se pudieron cargar');
  });
});
