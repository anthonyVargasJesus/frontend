import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { CoreConfigService } from '@core/services/config.service';
import { EvaluationService } from 'app/services/evaluation.service';

const mockEvaluation = {
  evaluationId: 1,
  standardId: 10,
  description: 'Evaluación - Agosto 2026',
  standard: { name: 'NTP-ISO/IEC 42001' },
  currentScope: { scopeId: 1, name: 'Alcance actual' },
  currentPolicy: { policyId: 1, name: 'Política actual' },
};

describe('HomeComponent (Resultados)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let evaluationServiceSpy: jasmine.SpyObj<EvaluationService>;

  beforeEach(async () => {
    evaluationServiceSpy = jasmine.createSpyObj('EvaluationService', ['getAll', 'getCurrent', 'getExcelDashboard']);
    evaluationServiceSpy.getAll.and.returnValue(of({ data: [mockEvaluation] }));
    evaluationServiceSpy.getCurrent.and.returnValue(of({ data: mockEvaluation }));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [NgbModule],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: CoreConfigService, useValue: { config: of({}) } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: EvaluationService, useValue: evaluationServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga la lista de evaluaciones (para el desplegable) y la evaluación actual', () => {
    fixture.detectChanges();
    expect(evaluationServiceSpy.getAll).toHaveBeenCalled();
    expect(evaluationServiceSpy.getCurrent).toHaveBeenCalledWith(undefined);
    expect(component.evaluationsList.length).toBe(1);
    expect(component.standardId).toBe('10');
    expect(component.standardName).toBe('NTP-ISO/IEC 42001');
    expect(component.selectedEvaluationId).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('onEvaluationChange pide esa evaluación puntual, no la "actual"', () => {
    fixture.detectChanges();
    evaluationServiceSpy.getCurrent.calls.reset();

    component.onEvaluationChange('7');

    expect(evaluationServiceSpy.getCurrent).toHaveBeenCalledWith(7);
  });

  it('downloadExcel pide el excel al backend y prende/apaga loadingExcel', () => {
    fixture.detectChanges();
    evaluationServiceSpy.getExcelDashboard.and.returnValue(of(new Blob()));

    component.downloadExcel();

    expect(evaluationServiceSpy.getExcelDashboard).toHaveBeenCalledWith('10', '1');
    expect(component.loadingExcel).toBeFalse();
  });

  it('si falla la carga de la evaluación actual, apaga el spinner sin romper', () => {
    evaluationServiceSpy.getCurrent.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });

  it('si falla downloadExcel, apaga loadingExcel sin romper', () => {
    fixture.detectChanges();
    evaluationServiceSpy.getExcelDashboard.and.returnValue(throwError({ status: 500, statusText: 'Error' }));

    component.downloadExcel();

    expect(component.loadingExcel).toBeFalse();
  });
});
