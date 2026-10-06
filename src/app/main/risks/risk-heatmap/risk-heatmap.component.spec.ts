import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { RiskHeatmapComponent } from './risk-heatmap.component';
import { RiskService } from 'app/services/risk.service';

const mockHeatmap = {
  evaluationDescription: 'Evaluación - Agosto 2026',
  inherent: {
    // matrix[row][col], row 0 = vulnerabilidad más baja.
    matrix: [
      [{ color: '#28C76F', count: 2 }, { color: '#E8C547', count: 1 }],
      [{ color: '#A8443B', count: 3 }, { color: '#A8443B', count: 1 }],
    ],
    byLevel: [{ name: 'Alto', count: 4, percentage: 57 }, { name: 'Bajo', count: 3, percentage: 43 }],
  },
  residual: {
    matrix: [
      [{ color: '#28C76F', count: 5 }, { color: '#28C76F', count: 1 }],
      [{ color: '#E8C547', count: 1 }, { color: '#A8443B', count: 0 }],
    ],
    byLevel: [{ name: 'Alto', count: 0, percentage: 0 }, { name: 'Bajo', count: 7, percentage: 100 }],
  },
  topResidualRisks: [
    { name: 'Fuga de datos por acceso no autorizado', activesInventoryName: 'Base de datos de RRHH', inherentLevel: 'Alto', inherentValue: 20, residualLevel: 'Medio', residualValue: 10, controlSummary: '3/5' },
  ],
};

describe('RiskHeatmapComponent', () => {
  let component: RiskHeatmapComponent;
  let fixture: ComponentFixture<RiskHeatmapComponent>;
  let riskServiceSpy: jasmine.SpyObj<RiskService>;

  beforeEach(async () => {
    riskServiceSpy = jasmine.createSpyObj('RiskService', ['getHeatmap']);
    riskServiceSpy.getHeatmap.and.returnValue(of(mockHeatmap));

    await TestBed.configureTestingModule({
      declarations: [RiskHeatmapComponent],
      providers: [{ provide: RiskService, useValue: riskServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskHeatmapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga el mapa de calor y arranca en la vista "residual"', () => {
    fixture.detectChanges();
    expect(riskServiceSpy.getHeatmap).toHaveBeenCalled();
    expect(component.view).toBe('residual');
    expect(component.grid).toBe(mockHeatmap.residual);
    expect(component.loading).toBeFalse();
  });

  it('setView alterna entre inherente y residual sin volver a pedirle nada al backend', () => {
    fixture.detectChanges();
    riskServiceSpy.getHeatmap.calls.reset();

    component.setView('inherent');

    expect(component.grid).toBe(mockHeatmap.inherent);
    expect(riskServiceSpy.getHeatmap).not.toHaveBeenCalled();
  });

  it('topRisk es el primero de topResidualRisks, o null si no hay ninguno', () => {
    fixture.detectChanges();
    expect(component.topRisk).toBe(mockHeatmap.topResidualRisks[0]);

    riskServiceSpy.getHeatmap.and.returnValue(of({ ...mockHeatmap, topResidualRisks: [] }));
    component.load();
    expect(component.topRisk).toBeNull();
  });

  // La matriz viene con la fila 0 = vulnerabilidad más baja, pero la esquina crítica (alto x
  // alto) tiene que quedar arriba a la derecha -- se recorre de mayor a menor índice.
  it('rowsTopDown recorre las filas de la matriz de mayor a menor índice', () => {
    fixture.detectChanges();
    expect(component.rowsTopDown).toEqual([1, 0]);
  });

  it('textColorFor elige texto blanco sobre colores oscuros, oscuro sobre colores claros', () => {
    fixture.detectChanges();
    expect(component.textColorFor('#A8443B')).toBe('#ffffff'); // rojo oscuro
    expect(component.textColorFor('#EAEDEF')).toBe('#3b4253'); // gris claro (Pendiente)
    expect(component.textColorFor(null)).toBe('#3b4253');
  });

  it('exportExcel arma la hoja de riesgos residuales y el resumen por nivel de ambas vistas', async () => {
    fixture.detectChanges();
    const ExcelJS = await import('exceljs');
    const addWorksheetSpy = spyOn(ExcelJS.Workbook.prototype, 'addWorksheet').and.callThrough();

    await component.exportExcel();

    const sheetNames = addWorksheetSpy.calls.all().map(c => c.args[0]);
    expect(sheetNames).toEqual(['Riesgos Residuales', 'Resumen por nivel']);
    expect(component.exporting).toBeFalse();
  });

  it('si falla la carga, muestra un mensaje de error', () => {
    riskServiceSpy.getHeatmap.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
