import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { MaturityRadarComponent } from './maturity-radar.component';
import { EvaluationService } from 'app/services/evaluation.service';
import { StandardService } from 'app/services/standard.service';

const mockRadarNoPrevious = {
  standardId: 10,
  standardName: 'NTP-ISO/IEC 42001',
  previousEvaluationId: null,
  domains: [
    { code: 'A.5', name: 'Políticas de seguridad', currentRate: 40, previousRate: null, delta: null, evaluatedControls: 2, totalControls: 5 },
    { code: 'A.6', name: 'Organización', currentRate: 60, previousRate: null, delta: null, evaluatedControls: 3, totalControls: 5 },
  ],
};

const mockRadarWithPrevious = {
  ...mockRadarNoPrevious,
  previousEvaluationId: 2,
  domains: mockRadarNoPrevious.domains.map(d => ({ ...d, previousRate: d.currentRate - 10, delta: 10 })),
};

describe('MaturityRadarComponent', () => {
  let component: MaturityRadarComponent;
  let fixture: ComponentFixture<MaturityRadarComponent>;
  let evaluationServiceSpy: jasmine.SpyObj<EvaluationService>;
  let standardServiceSpy: jasmine.SpyObj<StandardService>;

  beforeEach(async () => {
    evaluationServiceSpy = jasmine.createSpyObj('EvaluationService', ['getMaturityRadar']);
    evaluationServiceSpy.getMaturityRadar.and.returnValue(of(mockRadarNoPrevious));

    standardServiceSpy = jasmine.createSpyObj('StandardService', ['getAll']);
    standardServiceSpy.getAll.and.returnValue(of({ data: [{ standardId: 10, name: 'NTP-ISO/IEC 42001' }] }));

    await TestBed.configureTestingModule({
      declarations: [MaturityRadarComponent],
      providers: [
        { provide: EvaluationService, useValue: evaluationServiceSpy },
        { provide: StandardService, useValue: standardServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MaturityRadarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga el radar por dominio de la norma resuelta por el backend', () => {
    fixture.detectChanges();
    expect(evaluationServiceSpy.getMaturityRadar).toHaveBeenCalledWith(undefined);
    expect(component.data.domains.length).toBe(2);
    expect(component.selectedStandardId).toBe(10);
  });

  it('radarData solo trae la serie "Actual" cuando no hay ciclo anterior con el que comparar', () => {
    fixture.detectChanges();
    expect(component.radarData.length).toBe(1);
    expect(component.radarData[0].name).toBe('Actual');
    expect(component.radarData[0].series).toEqual([
      { name: 'Políticas de seguridad', value: 40 },
      { name: 'Organización', value: 60 },
    ]);
  });

  it('radarData agrega la serie "Ciclo anterior" cuando sí hay evaluación previa', () => {
    evaluationServiceSpy.getMaturityRadar.and.returnValue(of(mockRadarWithPrevious));
    fixture.detectChanges();

    expect(component.radarData.length).toBe(2);
    expect(component.radarData[1].name).toBe('Ciclo anterior');
    expect(component.radarData[1].series[0].value).toBe(30); // 40 - 10
  });

  it('en modo embebido usa siempre la norma del padre y no pide el desplegable', () => {
    component.embedded = true;
    component.standardId = 20;
    fixture.detectChanges();

    expect(standardServiceSpy.getAll).not.toHaveBeenCalled();
    expect(evaluationServiceSpy.getMaturityRadar).toHaveBeenCalledWith(20);
  });

  it('getDeltaIcon/getDeltaClass/getRateLabel manejan null como "sin dato"', () => {
    fixture.detectChanges();
    expect(component.getRateLabel(undefined)).toBe('—');
    expect(component.getDeltaIcon(null)).toBe('—');
    expect(component.getDeltaClass(0)).toBe('text-muted');
    expect(component.getDeltaIcon(3.2)).toBe('↑ +3.2%');
  });

  it('exportExcel arma una hoja "Radar por Dominio" con una fila por dominio', async () => {
    fixture.detectChanges();
    const ExcelJS = await import('exceljs');
    const addWorksheetSpy = spyOn(ExcelJS.Workbook.prototype, 'addWorksheet').and.callThrough();

    await component.exportExcel();

    const sheet = addWorksheetSpy.calls.mostRecent().returnValue;
    expect(addWorksheetSpy).toHaveBeenCalledWith('Radar por Dominio');
    expect((sheet.columns as any[]).map(c => c.header)).toEqual([
      'Dominio', 'Nombre', '% Actual', '% Ciclo anterior', 'Delta', 'Controles evaluados', 'Total controles',
    ]);
    expect(component.exporting).toBeFalse();
  });

  it('si falla la carga, deja de mostrar el spinner sin romper', () => {
    evaluationServiceSpy.getMaturityRadar.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
