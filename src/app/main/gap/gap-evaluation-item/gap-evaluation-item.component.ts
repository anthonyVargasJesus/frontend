import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { MaturityLevel } from 'app/models/maturity-level';
import { Responsible } from 'app/models/responsible';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import { ControlEvaluationService } from 'app/services/control-evaluation.service';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { ResponsibleService } from 'app/services/responsible.service';
import { ErrorManager } from 'app/errors/error-manager';
import { GapEvidenceListComponent } from '../gap-evidence-list/gap-evidence-list.component';

/**
 * Fila de evaluación (requisito o control) con la interacción del prototipo de Fable:
 * selección de nivel de madurez en un clic + panel "Detalle y evidencias" expandible en la
 * misma fila, sin modal. El estado/color/% y si "Acciones de mejora" es obligatorio se derivan
 * de las PROPIEDADES del nivel elegido (color, generatesBreach, isNotApplicable, value) — no de
 * comparar su nombre contra una lista fija. Tu catálogo de niveles ya cambió de escala una vez
 * (de 4 nombres a la escala CMM de 6 + "No aplicable") y este componente tenía los 4 nombres
 * viejos hardcodeados, lo que rompió en silencio el cálculo de "Acciones de mejora obligatorias"
 * y los colores. Con esto, un futuro cambio de catálogo (agregar/renombrar/quitar un nivel) no
 * requiere tocar este componente. Conserva todos los campos reales del registro (Responsable,
 * Justificación, Acciones de mejora, Evidencias).
 */
@Component({
  selector: 'app-gap-evaluation-item',
  templateUrl: './gap-evaluation-item.component.html',
  styleUrls: ['./gap-evaluation-item.component.scss']
})
export class GapEvaluationItemComponent implements OnInit, OnChanges {

  // 'requisito' usa RequirementEvaluationService; 'control' usa ControlEvaluationService.
  @Input() tipo: 'requisito' | 'control' = 'requisito';
  @Input() evaluacion: RequirementEvaluation | ControlEvaluation;
  @Input() standardId: number;
  @Input() evaluationId: number;

  // Tema mostrado debajo del nombre: "Cláusulas" para requisitos siempre; para controles, el
  // grupo (Organizacional/Personas/Físico/Tecnológico) — lo calcula la pantalla que arma la
  // lista (app-gap-panel) y lo pasa acá, porque esta fila no conoce por sí sola su grupo.
  @Input() theme: string;

  // Opcionales: si una lista padre ya cargó estos catálogos (p. ej. una pantalla con muchas
  // filas), se los pasa aquí para no repetir la llamada HTTP por cada fila. Si no se pasan,
  // el componente los carga por su cuenta (comportamiento original).
  @Input() maturityLevelsInput: MaturityLevel[];
  @Input() responsiblesInput: Responsible[];

  // Se emite tras cada guardado exitoso, para que la lista padre refresque igual que hoy.
  @Output() updateEvent = new EventEmitter<void>();

  // Referencia al listado de evidencias: solo existe en el DOM cuando expanded=true (está
  // dentro de un *ngIf), por eso "Adjuntar evidencia" no puede usar una variable de plantilla
  // (#evidenceList no es visible fuera de ese *ngIf) y en su lugar se resuelve vía ViewChild.
  @ViewChild('evidenceList') evidenceListRef: GapEvidenceListComponent;

  form: FormGroup;
  submitted = false;
  saving = false;
  expanded = false;

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  selectedMaturityLevel: MaturityLevel | null = null;

  constructor(
    private _fb: FormBuilder,
    private _requirementEvaluationService: RequirementEvaluationService,
    private _controlEvaluationService: ControlEvaluationService,
    private _maturityLevelService: MaturityLevelService,
    private _responsibleService: ResponsibleService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCatalogs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.evaluacion && this.form)
      this.setFormValue();
  }

  // Requisito y Control comparten la misma forma de negocio; solo cambia el objeto anidado.
  get item(): any {
    return (this.evaluacion as any)?.requirement || (this.evaluacion as any)?.control || {};
  }

  // Si nadie pasó [theme] explícito (p. ej. el árbol de /gap/requirement-evaluation, que solo
  // muestra requisitos), un requisito siempre es "Cláusulas"; un control no tiene un valor por
  // defecto razonable sin el grupo real, así que ahí sí depende de que el padre lo pase.
  get displayTheme(): string {
    if (this.theme) return this.theme;
    return this.tipo === 'requisito' ? 'Cláusulas' : '';
  }

  get itemEvaluationId(): number {
    return this.tipo === 'requisito'
      ? (this.evaluacion as RequirementEvaluation).requirementEvaluationId
      : (this.evaluacion as ControlEvaluation).controlEvaluationId;
  }

  // Mientras el ítem no tenga una evaluación real guardada (id=0, placeholder que arma el
  // backend para ítems nunca evaluados), adjuntar evidencia dejaría una fila huérfana o
  // fallaría por la FK a MAE_REQUIREMENT_EVALUATION/MAE_CONTROL_EVALUATION.
  get hasSavedEvaluation(): boolean {
    return !!this.itemEvaluationId;
  }

  get requirementEvaluationIdForEvidence(): number {
    return this.tipo === 'requisito' ? this.itemEvaluationId : null;
  }

  get controlEvaluationIdForEvidence(): number {
    return this.tipo === 'control' ? this.itemEvaluationId : null;
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this._fb.group({
      maturityLevel: ['', [Validators.required]],
      responsible: ['', [Validators.required]],
      justification: ['', [Validators.required, Validators.maxLength(500)]],
      // El validador real se decide en updateImprovementActionsValidators() según el estado
      // elegido (Parcial/No cumple => obligatorio); acá solo se pone el límite de caracteres.
      // 500, no 1000: este componente evalúa controles Y requisitos con el mismo formulario, y
      // MAE_CONTROL_EVALUATION.C_IMPROVEMENT_ACTIONS es varchar(500) (MAE_REQUIREMENT_EVALUATION
      // la tiene como "text" sin límite, pero hay que usar el más chico de los dos para que no
      // truene al guardar un control con texto de más de 500 -- mismo "22001: value too long"
      // disfrazado de "Failed Request" que ya pasó con el título del plan de acción).
      improvementActions: ['', [Validators.maxLength(500)]],
    });
    this.setFormValue();
  }

  setFormValue() {
    if (!this.evaluacion || !this.form) return;
    this.form.patchValue({
      // "|| ''" y no "?? ''": el backend usa 0 (no null) como sentinela de "sin valor todavía"
      // para maturityLevelId/responsibleId (p. ej. cuando la cláusula no tiene responsable por
      // defecto configurado). Con "??" ese 0 pasaba el Validators.required sin marcar error.
      maturityLevel: this.evaluacion.maturityLevelId || '',
      responsible: this.evaluacion.responsibleId || '',
      justification: this.evaluacion.justification ?? '',
      improvementActions: this.evaluacion.improvementActions ?? '',
    });
    this.syncSelectedMaturityLevel();
  }

  private loadCatalogs() {
    if (this.maturityLevelsInput?.length) {
      this.maturityLevels = this.maturityLevelsInput;
      this.syncSelectedMaturityLevel();
    } else {
      this._maturityLevelService.getAll().subscribe((res: any) => {
        this.maturityLevels = res.data;
        this.syncSelectedMaturityLevel();
      }, error => ErrorManager.handleError(error));
    }

    if (this.responsiblesInput?.length) {
      this.responsibles = this.responsiblesInput;
    } else {
      this._responsibleService.getAll(this.standardId).subscribe((res: any) => {
        this.responsibles = res.data;
      }, error => ErrorManager.handleError(error));
    }
  }

  private syncSelectedMaturityLevel() {
    const id = this.form?.value?.maturityLevel;
    this.selectedMaturityLevel = this.maturityLevels.find(m => m.maturityLevelId === Number(id)) || null;
    this.updateImprovementActionsValidators();
  }

  // Norma ISO 27001:2022, cláusula 10.2 (no conformidad y acción correctiva): la acción de
  // mejora corresponde a una no conformidad — es decir, a Parcial o No cumple. Si el estado es
  // Cumple o No aplica no hay no conformidad que corregir, así que queda opcional.
  private updateImprovementActionsValidators() {
    const control = this.form?.get('improvementActions');
    if (!control) return;
    control.setValidators(this.improvementActionsRequired
      ? [Validators.required, Validators.maxLength(1000)]
      : [Validators.maxLength(1000)]);
    control.updateValueAndValidity({ emitEvent: false });
  }

  // Norma ISO 27001:2022, cláusula 10.2: la acción de mejora corresponde a una no conformidad
  // -- es decir, a cualquier nivel que el catálogo marque como generador de brecha
  // (MaturityLevel.generatesBreach), ya no a comparar el nombre contra "Parcial"/"No cumple".
  get improvementActionsRequired(): boolean {
    return this.selectedMaturityLevel?.generatesBreach ?? false;
  }

  // Fondo pastel del chip cuando NO está seleccionado: el mismo color del nivel, aclarado
  // (mezclado con blanco vía alpha bajo) en vez de un color fijo por nombre -- así cualquier
  // nivel del catálogo, incluidos los que se agreguen a futuro, se ve bien sin tocar este
  // componente. Mismo criterio que soa-report.component.ts#pillBackground.
  paleBackgroundFor(maturityLevel: MaturityLevel): string {
    const hex = maturityLevel.color || '#8A939B';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '#F1F3F4';
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }

  toggleDetalle() {
    this.expanded = !this.expanded;
  }

  attachEvidence() {
    this.expanded = true;
    // El *ngIf que renderiza app-gap-evidence-list se actualiza en el mismo ciclo de detección
    // de cambios; el setTimeout empuja la llamada a la siguiente vuelta para que evidenceListRef
    // ya esté resuelto incluso si el panel estaba cerrado antes de este clic.
    setTimeout(() => this.evidenceListRef?.add());
  }

  attachLink() {
    this.expanded = true;
    setTimeout(() => this.evidenceListRef?.openAddLink());
  }

  pickMaturityLevel(maturityLevel: MaturityLevel) {
    this.form.patchValue({ maturityLevel: maturityLevel.maturityLevelId });
    this.selectedMaturityLevel = maturityLevel;
    this.updateImprovementActionsValidators();
    if (!this.expanded) this.expanded = true;
  }

  // Nombre del nivel elegido, o 'Pendiente' si todavía no se seleccionó ninguno -- ya no valida
  // contra una lista fija: cualquier nivel del catálogo de niveles de madurez de la empresa vale.
  get estado(): string {
    return this.selectedMaturityLevel?.name ?? 'Pendiente';
  }

  get porcentaje(): number {
    if (!this.selectedMaturityLevel || this.selectedMaturityLevel.isNotApplicable) return 0;
    const value = this.selectedMaturityLevel.value;
    // El catálogo usa una escala 0-5 (ver 001_maturity_levels_cmm_scale.sql); si en el futuro
    // cambia el tope de la escala, este cálculo hay que revisarlo junto con esa migración.
    return value ? Math.round((value / 5) * 100) : 0;
  }

  // El color de cada nivel ya vive en el catálogo (MaturityLevel.color) -- no hace falta
  // duplicarlo acá por nombre. Gris neutro cuando todavía no se eligió ningún nivel.
  get estadoColor(): string {
    return this.selectedMaturityLevel?.color || '#8A939B';
  }

  save() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.saving = true;
    this.evaluacion.maturityLevelId = Number(this.form.value.maturityLevel);
    this.evaluacion.responsibleId = this.form.value.responsible;
    this.evaluacion.justification = this.form.value.justification;
    this.evaluacion.improvementActions = this.form.value.improvementActions;
    // El listado de la pantalla (GetRequirementEvaluationByProcess/GetControlEvaluationByProcess)
    // no expone requirementId/controlId/value a nivel raíz de la evaluación (solo dentro del
    // requirement/control anidado), así que hay que completarlos acá antes de guardar.
    this.evaluacion.value = this.selectedMaturityLevel?.value;

    const onSaved = (res: any) => {
      this.evaluacion = res.data;
      this.saving = false;
      this.submitted = false;
      this.setFormValue();
      this.updateEvent.emit();
    };
    const onError = (error: any) => {
      this.saving = false;
      ErrorManager.handleError(error);
    };

    // Si nunca se guardó una evaluación real para este ítem, itemEvaluationId es el placeholder
    // 0 que arma el backend — hay que crear (POST) en vez de actualizar (PUT) un id inexistente.
    const isNew = !this.hasSavedEvaluation;

    if (this.tipo === 'requisito') {
      const requirementEvaluation = this.evaluacion as RequirementEvaluation;
      requirementEvaluation.requirementId = this.item.requirementId;

      if (isNew) {
        requirementEvaluation.evaluationId = this.evaluationId;
        requirementEvaluation.standardId = this.standardId;
        this._requirementEvaluationService.insert(requirementEvaluation).subscribe(onSaved, onError);
      } else {
        this._requirementEvaluationService.update(requirementEvaluation).subscribe(onSaved, onError);
      }
    } else {
      const controlEvaluation = this.evaluacion as ControlEvaluation;
      controlEvaluation.controlId = this.item.controlId;

      if (isNew) {
        controlEvaluation.evaluationId = this.evaluationId;
        controlEvaluation.standardId = this.standardId;
        // El alta de control exige estos dos campos aunque no se usen en esta pantalla; la
        // pantalla legacy (AddControlEvaluationComponent) también los mandaba vacíos.
        controlEvaluation.controlType = controlEvaluation.controlType || '';
        controlEvaluation.controlDescription = controlEvaluation.controlDescription || '';
        this._controlEvaluationService.insert(controlEvaluation).subscribe(onSaved, onError);
      } else {
        this._controlEvaluationService.update(controlEvaluation).subscribe(onSaved, onError);
      }
    }
  }

  onEvidenceUpdated() {
    this.updateEvent.emit();
  }

}
