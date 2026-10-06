import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ComplianceEvolutionComponent } from './compliance-evolution.component';
import { EvaluationService } from 'app/services/evaluation.service';
import { StandardService } from 'app/services/standard.service';

const mockEvolution = {
  standardId: 10,
  standardName: 'NTP-ISO/IEC 42001',
  evaluations: [
    { description: 'Evaluación - Mayo 2026', startDate: '2026-05-01', endDate: '2026-05-31', requirementsRate: 40, controlsRate: 25, overallRate: 30 },
    { description: 'Evaluación - Agosto 2026', startDate: '2026-08-01', endDate: '2026-08-31', requirementsRate: 55, controlsRate: 33, overallRate: 40 },
  ],
  changes: [
    { tipo: 'control', code: '2.2', name: 'Alineamiento', previousLevel: 'Inicial', currentLevel: 'Definido', improved: true },
  ],
};

describe('ComplianceEvolutionComponent', () => {
  let component: ComplianceEvolutionComponent;
  let fixture: ComponentFixture<ComplianceEvolutionComponent>;
  let evaluationServiceSpy: jasmine.SpyObj<EvaluationService>;
  let standardServiceSpy: jasmine.SpyObj<StandardService>;

  beforeEach(async () => {
    evaluationServiceSpy = jasmine.createSpyObj('EvaluationService', ['getComplianceEvolution']);
    evaluationServiceSpy.getComplianceEvolution.and.returnValue(of(mockEvolution));

    standardServiceSpy = jasmine.createSpyObj('StandardService', ['getAll']);
    standardServiceSpy.getAll.and.returnValue(of({ data: [{ standardId: 10, name: 'NTP-ISO/IEC 42001' }] }));

    await TestBed.configureTestingModule({
      declarations: [ComplianceEvolutionComponent],
      providers: [
        { provide: EvaluationService, useValue: evaluationServiceSpy },
        { provide: StandardService, useValue: standardServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceEvolutionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('en modo standalone, carga el desplegable de normas y la evolución de la norma resuelta por el backend', () => {
    fixture.detectChanges();
    expect(standardServiceSpy.getAll).toHaveBeenCalled();
    expect(evaluationServiceSpy.getComplianceEvolution).toHaveBeenCalledWith(undefined);
    expect(component.standards.length).toBe(1);
    expect(component.data.standardId).toBe(10);
    expect(component.selectedStandardId).toBe(10); // se sincroniza con lo que resolvió el backend
  });

  it('en modo embebido, no pide el desplegable de normas y usa siempre la norma del padre', () => {
    component.embedded = true;
    component.standardId = 20;
    fixture.detectChanges();

    expect(standardServiceSpy.getAll).not.toHaveBeenCalled();
    expect(evaluationServiceSpy.getComplianceEvolution).toHaveBeenCalledWith(20);
  });

  it('onStandardChange vuelve a pedir la evolución con la norma elegida', () => {
    fixture.detectChanges();
    component.selectedStandardId = 99;
    evaluationServiceSpy.getComplianceEvolution.calls.reset();

    component.onStandardChange();

    expect(evaluationServiceSpy.getComplianceEvolution).toHaveBeenCalledWith(99);
  });

  it('getRateLabel/getDeltaIcon/getDeltaClass manejan null como "sin dato", no como 0', () => {
    fixture.detectChanges();
    expect(component.getRateLabel(null)).toBe('—');
    expect(component.getRateLabel(33.4)).toBe('33.4%');
    expect(component.getDeltaClass(null)).toBe('text-muted');
    expect(component.getDeltaClass(5)).toBe('text-success');
    expect(component.getDeltaClass(-5)).toBe('text-danger');
    expect(component.getDeltaIcon(5)).toBe('↑ +5.0%');
    expect(component.getDeltaIcon(-5)).toBe('↓ -5.0%');
  });

  it('getCompletionBarClass clasifica por umbrales de %', () => {
    fixture.detectChanges();
    expect(component.getCompletionBarClass(80)).toBe('bg-success');
    expect(component.getCompletionBarClass(60)).toBe('bg-info');
    expect(component.getCompletionBarClass(30)).toBe('bg-warning');
    expect(component.getCompletionBarClass(10)).toBe('bg-danger');
    expect(component.getCompletionBarClass(null)).toBe('bg-secondary');
  });

  it('exportExcel arma 2 hojas: Historial y Cambios', async () => {
    fixture.detectChanges();
    const ExcelJS = await import('exceljs');
    const addWorksheetSpy = spyOn(ExcelJS.Workbook.prototype, 'addWorksheet').and.callThrough();

    await component.exportExcel();

    const sheetNames = addWorksheetSpy.calls.all().map(c => c.args[0]);
    expect(sheetNames).toEqual(['Historial', 'Cambios']);
    expect(component.exporting).toBeFalse();
  });

  it('exportExcel no arma la hoja "Cambios" si no hay cambios que reportar', async () => {
    evaluationServiceSpy.getComplianceEvolution.and.returnValue(of({ ...mockEvolution, changes: [] }));
    fixture.detectChanges();
    const ExcelJS = await import('exceljs');
    const addWorksheetSpy = spyOn(ExcelJS.Workbook.prototype, 'addWorksheet').and.callThrough();

    await component.exportExcel();

    const sheetNames = addWorksheetSpy.calls.all().map(c => c.args[0]);
    expect(sheetNames).toEqual(['Historial']);
  });

  it('si falla la carga, deja de mostrar el spinner sin romper', () => {
    evaluationServiceSpy.getComplianceEvolution.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
