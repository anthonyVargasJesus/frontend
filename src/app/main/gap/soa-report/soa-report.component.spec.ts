import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { SoaReportComponent } from './soa-report.component';
import { GapDashboardService } from 'app/services/gap-dashboard.service';

const mockSoaReport = {
  hasCurrentEvaluation: true,
  standardName: 'NTP-ISO/IEC 42001',
  controls: [
    {
      code: '2.1', name: 'Política de IA', description: 'Debe documentar una política de IA.',
      theme: 'Políticas relacionadas con la IA', aplica: true,
      implementacion: 'No implementado', justificacion: 'A la fecha no hay política formal.',
    },
    {
      code: '2.2', name: 'Alineamiento con otras políticas', description: 'Debe alinearse con otras políticas.',
      theme: 'Políticas relacionadas con la IA', aplica: true,
      implementacion: 'Definido', justificacion: 'Hace referencia explícita a la Política de Seguridad.',
    },
    {
      code: '4.1', name: 'Contexto de la organización', description: 'Requisito de la cláusula 4.',
      theme: 'Cláusulas', aplica: null,
      implementacion: '', justificacion: '',
    },
  ],
};

describe('SoaReportComponent', () => {
  let component: SoaReportComponent;
  let fixture: ComponentFixture<SoaReportComponent>;
  let gapDashboardServiceSpy: jasmine.SpyObj<GapDashboardService>;

  beforeEach(async () => {
    gapDashboardServiceSpy = jasmine.createSpyObj('GapDashboardService', ['getSoaReport']);
    gapDashboardServiceSpy.getSoaReport.and.returnValue(of(mockSoaReport));

    await TestBed.configureTestingModule({
      declarations: [SoaReportComponent],
      providers: [{ provide: GapDashboardService, useValue: gapDashboardServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SoaReportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga los controles del Anexo A desde /api/gapDashboard/soa-report', () => {
    fixture.detectChanges();
    expect(gapDashboardServiceSpy.getSoaReport).toHaveBeenCalled();
    expect(component.controls.length).toBe(3);
    expect(component.standardName).toBe('NTP-ISO/IEC 42001');
    expect(component.loading).toBeFalse();
  });

  it('cuenta los controles/cláusulas sin evaluar (aplica === null)', () => {
    fixture.detectChanges();
    expect(component.pendingCount).toBe(1);
  });

  it('agrupa por área manteniendo el orden en que ya vienen (no alfabético)', () => {
    fixture.detectChanges();
    const groups = component.groupedControls;
    expect(groups.map(g => g.theme)).toEqual(['Políticas relacionadas con la IA', 'Cláusulas']);
    expect(groups[0].items.length).toBe(2);
  });

  it('aplicaLabel distingue Aplica/No aplica/Sin evaluar', () => {
    fixture.detectChanges();
    expect(component.aplicaLabel(component.controls[0])).toBe('Aplica');
    expect(component.aplicaLabel(component.controls[2])).toBe('Sin evaluar');
    expect(component.aplicaLabel({ ...component.controls[0], aplica: false })).toBe('No aplica');
  });

  it('el color del pill "¿Aplica?" refleja el estado (verde/rojo/gris), el de implementación no', () => {
    fixture.detectChanges();
    expect(component.aplicaColor(component.controls[0])).not.toBe(component.aplicaColor(component.controls[2]));
  });

  it('si falla la carga, muestra un mensaje de error', () => {
    gapDashboardServiceSpy.getSoaReport.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('No se pudo cargar');
  });

  // Regresión: el Excel exportado tiene que traer las 7 columnas reales (Código/Control/
  // Descripción/Área/¿Aplica?/Nivel de madurez/Justificación) -- ver la comparación con el
  // export de Flutter, que al principio le faltaban Descripción y Área.
  it('exportExcel arma un libro con las 7 columnas esperadas, en el mismo orden', async () => {
    fixture.detectChanges();
    const ExcelJS = await import('exceljs');
    const addWorksheetSpy = spyOn(ExcelJS.Workbook.prototype, 'addWorksheet').and.callThrough();

    await component.exportExcel();

    const sheet = addWorksheetSpy.calls.mostRecent().returnValue;
    const headers = (sheet.columns as any[]).map(c => c.header);
    expect(headers).toEqual(['Código', 'Control', 'Descripción', 'Área', '¿Aplica?', 'Nivel de madurez', 'Justificación']);
    expect(component.exporting).toBeFalse();
  });
});
