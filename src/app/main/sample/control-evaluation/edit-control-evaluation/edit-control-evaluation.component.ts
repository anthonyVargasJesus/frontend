import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlEvaluationService } from 'app/services/control-evaluation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MaturityLevel } from 'app/models/maturity-level';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';
import { Console } from 'console';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { ReferenceDocumentation } from 'app/models/reference-documentation';


@Component({
  selector: 'app-edit-control-evaluation',
  templateUrl: './edit-control-evaluation.component.html',
  styles: [
  ]
})
export class EditControlEvaluationComponent implements OnInit {

  constructor(
    private controlEvaluationService: ControlEvaluationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private maturityLevelService: MaturityLevelService,
    private responsibleService: ResponsibleService,
    private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditControlEvaluationComponent>,

  ) { }

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  documentations: Documentation[] = [];
  controlEvaluation: ControlEvaluation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  controlName: string;
  numeration: string;
  public submitted = false;
  public last: string = '';
  standardId: string;

  selectedMaturityLevel: MaturityLevel = new MaturityLevel();

  ngOnInit(): void {
    this.initForm();
  
    this.initControlEvaluation();
    this.id = this.data['_id'];
    this.standardId = this.data['standardId'];
    this.controlName = this.data['controlName'];
    this.numeration = this.data['numeration'];
    this.getAllMaturityLevels();
    this.getAllResponsibles();
    this.getAllDocumentations();

  }


  initControlEvaluation() {
    this.controlEvaluation = new ControlEvaluation();
    this.initMaturityLevel();
    this.initResponsible();
  }
  initMaturityLevel() {
    if (this.maturityLevels.length > 0)
      this.controlEvaluation.maturityLevel = this.maturityLevels[0];
  }


  initResponsible() {
    if (this.responsibles.length > 0)
      this.controlEvaluation.responsible = this.responsibles[0];
  }



  initForm() {
    this.form = this._formBuilder.group({
      maturityLevel: ['', [Validators.required,]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
      responsible: ['', [Validators.required,]],
      justification: ['', [Validators.required, Validators.maxLength(500),]],
      improvementActions: ['', [Validators.required, Validators.maxLength(500),]],
      documentation: ['', [Validators.required,]],
    });
  }

  getAllDocumentations() {
    this.documentationService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.documentations = res.data;
        this.obtain(this.id);
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  obtain(id: string) {
    this.loading = true;
    this.controlEvaluationService.obtain(id)
      .subscribe((res: any) => {
        this.controlEvaluation = res.data;
        console.log(res);
        this.setFormValue(this.controlEvaluation);
        this.changeMaturityLevel(this.controlEvaluation.maturityLevelId.toString());
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(controlEvaluation: ControlEvaluation) {
    this.form.setValue({
      maturityLevel: ((controlEvaluation.maturityLevelId == null) ? '' : controlEvaluation.maturityLevelId),
      value: ((controlEvaluation.value == null) ? '' : controlEvaluation.value),
      responsible: ((controlEvaluation.responsibleId == null) ? '' : controlEvaluation.responsibleId),
      justification: ((controlEvaluation.justification == null) ? '' : controlEvaluation.justification),
      improvementActions: ((controlEvaluation.improvementActions == null) ? '' : controlEvaluation.improvementActions),
      documentation: controlEvaluation.arrayReferenceDocumentations
    });


  }


  getFormValue() {
    if (this.form.value.maturityLevel)
      this.controlEvaluation.maturityLevelId = this.form.value.maturityLevel;
    if (this.form.value.responsible)
      this.controlEvaluation.responsibleId = this.form.value.responsible;
    this.controlEvaluation.justification = this.form.value.justification;
    this.controlEvaluation.improvementActions = this.form.value.improvementActions;
  }


  getAllMaturityLevels() {
    this.maturityLevelService.getAll()
      .subscribe((res: any) => {
        this.maturityLevels = res.data;
        this.initControlEvaluation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getAllResponsibles() {
    this.responsibleService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.initControlEvaluation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  get f() {
    return this.form.controls;
  }


  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.controlEvaluation.value = this.selectedMaturityLevel.value;

    let array = [];
    array = this.form.value.documentation;

    let referenceDocumentations: ReferenceDocumentation[] = [];
    array.forEach(id => {
      let model: ReferenceDocumentation = new ReferenceDocumentation();
      model.name = this.getDocumentationName(id);
      model.documentationId = id;
      model.evaluationId = Number(this.controlEvaluation.evaluationId);
      referenceDocumentations.push(model);
    });

    this.controlEvaluation.referenceDocumentations = referenceDocumentations;
    

    this.controlEvaluationService.update(this.controlEvaluation)
      .subscribe(res => {
        this.controlEvaluation = res.data;
        this.dialogRef.close({ updated: true });
        this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  getDocumentationName(id: number) {
    let name = '';
    this.documentations.forEach(item => {
      if (item.documentationId == id)
        name = item.name;
    });
    return name;
  }

  changeMaturityLevel(id: string) {

    this.selectedMaturityLevel = new MaturityLevel();
    this.maturityLevels.forEach(item => {
      if (item.maturityLevelId.toString() == id) {
        this.selectedMaturityLevel = item;
        this.form.patchValue({
          value: item.value,
        });
      }
    });

  }


  close() {
    this.dialogRef.close();
  }

}
