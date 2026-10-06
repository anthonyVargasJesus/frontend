import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ActionPlanCalendarComponent } from './action-plan-calendar.component';
import { GapService } from 'app/services/gap.service';
import { ActionPlanService } from 'app/services/action-plan.service';

const mockResumen = { evaluation: { evaluationId: 1, standardId: 10 } };

const currentYear = new Date().getFullYear();

function mockCalendarPage(totalRows: number) {
  return {
    items: [
      {
        actionPlanId: 1, controlCode: '2.1', controlName: 'Política de IA', title: 'Redactar la política',
        responsibleName: 'Gina Meza', startDate: `${currentYear}-02-01`, dueDate: `${currentYear}-04-15`,
        statusName: 'En curso', statusAbbreviation: 'EC', statusColor: '#2971B9',
      },
    ],
    statusSummary: [{ statusId: 1, statusName: 'Pendiente', statusColor: '#8A939B', monthCounts: new Array(12).fill(0) }],
    pagination: { totalRows, totalPages: Math.ceil(totalRows / 15) },
  };
}

describe('ActionPlanCalendarComponent', () => {
  let component: ActionPlanCalendarComponent;
  let fixture: ComponentFixture<ActionPlanCalendarComponent>;
  let gapServiceSpy: jasmine.SpyObj<GapService>;
  let actionPlanServiceSpy: jasmine.SpyObj<ActionPlanService>;

  beforeEach(async () => {
    gapServiceSpy = jasmine.createSpyObj('GapService', ['getResumen']);
    gapServiceSpy.getResumen.and.returnValue(of(mockResumen));

    actionPlanServiceSpy = jasmine.createSpyObj('ActionPlanService', ['getCalendar']);
    actionPlanServiceSpy.getCalendar.and.returnValue(of(mockCalendarPage(1)));

    await TestBed.configureTestingModule({
      declarations: [ActionPlanCalendarComponent],
      providers: [
        { provide: GapService, useValue: gapServiceSpy },
        { provide: ActionPlanService, useValue: actionPlanServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPlanCalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('resuelve la evaluación actual (scopeToUser=false) y después pide el calendario de ese año', () => {
    fixture.detectChanges();
    expect(gapServiceSpy.getResumen).toHaveBeenCalledWith(false);
    expect(actionPlanServiceSpy.getCalendar).toHaveBeenCalledWith(1, currentYear, 0, 15);
    expect(component.items.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('un plan de acción que empieza en febrero y vence en abril solo pinta esos meses', () => {
    fixture.detectChanges();
    const months = Array.from(component.items[0].monthsInYear).sort((a, b) => a - b);
    expect(months).toEqual([1, 2, 3]); // Feb=1, Mar=2, Abr=3 (0-indexado)
  });

  it('changeYear reinicia la página y vuelve a pedir el calendario del año nuevo', () => {
    fixture.detectChanges();
    actionPlanServiceSpy.getCalendar.calls.reset();

    component.changeYear(1);

    expect(component.year).toBe(currentYear + 1);
    expect(actionPlanServiceSpy.getCalendar).toHaveBeenCalledWith(1, currentYear + 1, 0, 15);
  });

  it('changePage no avanza más allá del total ni retrocede antes del principio', () => {
    actionPlanServiceSpy.getCalendar.and.returnValue(of(mockCalendarPage(15))); // exactamente 1 página
    fixture.detectChanges();
    actionPlanServiceSpy.getCalendar.calls.reset();

    component.changePage(15); // "siguiente" cuando ya no hay más -- no debería pedir nada
    expect(actionPlanServiceSpy.getCalendar).not.toHaveBeenCalled();

    component.changePage(-15); // "anterior" antes del principio -- tampoco
    expect(actionPlanServiceSpy.getCalendar).not.toHaveBeenCalled();
  });

  it('el resumen mensual trae una fila por cada estado real del catálogo, no una lista fija', () => {
    fixture.detectChanges();
    expect(component.statusSummary.length).toBe(1);
    expect(component.statusSummary[0].statusName).toBe('Pendiente');
    expect(component.statusSummary[0].monthCounts.length).toBe(12);
  });

  it('si la evaluación actual no existe, no intenta pedir el calendario', () => {
    gapServiceSpy.getResumen.and.returnValue(of({ evaluation: null }));
    fixture.detectChanges();

    expect(actionPlanServiceSpy.getCalendar).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('si falla la carga, muestra un mensaje de error', () => {
    gapServiceSpy.getResumen.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('No se pudo cargar');
  });
});
