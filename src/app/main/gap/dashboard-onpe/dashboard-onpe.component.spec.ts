import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { DashboardOnpeComponent } from './dashboard-onpe.component';
import { GapDashboardService } from 'app/services/gap-dashboard.service';

const mockDashboard = {
  hasCurrentEvaluation: true,
  evaluationId: 1,
  standardName: 'NTP-ISO/IEC 42001',
  evaluationDescription: 'Evaluación - Agosto 2026',
  madurezGeneral: 2.96,
  madurezGeneralPercent: 0.592,
  grupos: [
    { grupo: 'Controles Organizacionales', actual: 1.2, meta: 5, actualPercent: 0.24 },
    { grupo: 'Controles de Personas', actual: 3.5, meta: 5, actualPercent: 0.7 },
    { grupo: 'Controles Físicos', actual: 0, meta: 5, actualPercent: 0 },
    { grupo: 'Controles Tecnológicos', actual: 4.1, meta: 5, actualPercent: 0.82 },
  ],
  controles: [
    { grupo: 'Controles Organizacionales', code: '2.1', name: 'Política de IA', madurez: 0, madurezColor: '#A8443B', nivel: 'No implementado', isNotApplicable: false },
    { grupo: 'Controles Organizacionales', code: '2.2', name: 'Alineamiento', madurez: 3, madurezColor: '#8BC34A', nivel: 'Definido', isNotApplicable: false },
    { grupo: 'Controles de Personas', code: '6.1', name: 'Control X', madurez: null, madurezColor: null, nivel: 'Pendiente', isNotApplicable: false },
    { grupo: 'Controles Físicos', code: '7.1', name: 'Control Y', madurez: null, madurezColor: null, nivel: 'No aplicable', isNotApplicable: true },
  ],
};

describe('DashboardOnpeComponent', () => {
  let component: DashboardOnpeComponent;
  let fixture: ComponentFixture<DashboardOnpeComponent>;
  let gapDashboardServiceSpy: jasmine.SpyObj<GapDashboardService>;

  beforeEach(async () => {
    gapDashboardServiceSpy = jasmine.createSpyObj('GapDashboardService', ['getDashboardOnpe']);
    gapDashboardServiceSpy.getDashboardOnpe.and.returnValue(of(mockDashboard));

    await TestBed.configureTestingModule({
      declarations: [DashboardOnpeComponent],
      imports: [NgbModule],
      providers: [{ provide: GapDashboardService, useValue: gapDashboardServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOnpeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('carga el dashboard desde /api/gapDashboard/dashboard-onpe', () => {
    fixture.detectChanges();
    expect(gapDashboardServiceSpy.getDashboardOnpe).toHaveBeenCalled();
    expect(component.madurezGeneral).toBe(2.96);
    expect(component.grupos.length).toBe(4);
    expect(component.loading).toBeFalse();
  });

  it('el header usa Madurez General (no el % de cumplimiento global) y solo cuenta controles evaluados', () => {
    fixture.detectChanges();
    // pct = round(madurezGeneralPercent * 100)
    expect(component.headerStats.pct).toBe(59);
    // evaluados: ni null ni isNotApplicable -- de los 4 controles, solo 2 (2.1 y 2.2) califican.
    expect(component.headerStats.evaluados).toBe(2);
    expect(component.headerStats.total).toBe(4);
  });

  it('la dona reparte proporcional al "actual" de cada grupo, no en partes iguales', () => {
    fixture.detectChanges();
    const segments = component.donutSegments;
    // El grupo con actual=0 (Controles Físicos) no genera segmento.
    expect(segments.length).toBe(3);
    const total = mockDashboard.grupos.reduce((s, g) => s + g.actual, 0);
    const organizacionales = segments.find(s => s.name === 'Controles Organizacionales')!;
    const esperado = (1.2 / total) * (2 * Math.PI * 50);
    expect(organizacionales.dasharray.split(' ')[0]).toBeCloseTo(esperado, 2);
  });

  it('agrupa los controles por tema en el orden en que ya vienen del backend', () => {
    fixture.detectChanges();
    const themes = component.groupedControles.map(g => g.theme);
    expect(themes).toEqual(['Controles Organizacionales', 'Controles de Personas', 'Controles Físicos']);
  });

  it('los pendientes cuentan como 0 en el radar por grupo, sin excluirse', () => {
    fixture.detectChanges();
    const personas = component.groupedControles.find(g => g.theme === 'Controles de Personas')!;
    expect(personas.radarData[0].series[0].value).toBe(0); // control 6.1, madurez null -> 0
  });

  it('madurezNumberLabel muestra "—" para pendientes, el número real para el resto', () => {
    fixture.detectChanges();
    expect(component.madurezNumberLabel(mockDashboard.controles[0] as any)).toBe('0');
    expect(component.madurezNumberLabel(mockDashboard.controles[2] as any)).toBe('—');
  });

  it('madurezColor cae a gris para pendientes y no aplicables, aunque tengan un color', () => {
    fixture.detectChanges();
    expect(component.madurezColor(mockDashboard.controles[0] as any)).toBe('#A8443B');
    expect(component.madurezColor(mockDashboard.controles[3] as any)).toBe('#6B7480'); // no aplicable
  });

  it('themeColor usa el mismo color que la fila de "grupos" correspondiente', () => {
    fixture.detectChanges();
    expect(component.themeColor('Controles Organizacionales')).toBe(component.groupColor(0));
    expect(component.themeColor('Controles Tecnológicos')).toBe(component.groupColor(3));
  });

  it('si falla la carga, muestra un mensaje de error', () => {
    gapDashboardServiceSpy.getDashboardOnpe.and.returnValue(throwError({ status: 500, statusText: 'Error' }));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toContain('No se pudo cargar');
  });
});
