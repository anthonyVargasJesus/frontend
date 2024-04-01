import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlEvaluationService } from 'app/services/control-evaluation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MaturityLevel } from 'app/models/maturity-level';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { Evaluation } from 'app/models/evaluation';
import { Control } from 'app/models/control';
import { DialogData } from 'app/models/dialog-data';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { ReferenceDocumentation } from 'app/models/reference-documentation';


@Component({
  selector: 'app-add-control-evaluation',
  templateUrl: './add-control-evaluation.component.html',
  styles: [
  ]
})
export class AddControlEvaluationComponent implements OnInit {

  constructor(
    private controlEvaluationService: ControlEvaluationService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddControlEvaluationComponent>,
    private maturityLevelService: MaturityLevelService,
    private responsibleService: ResponsibleService,
    private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  documentations: Documentation[] = [];

  controlEvaluation: ControlEvaluation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  evaluationId: number;
  controlId: string;
  controlName: string;
  numeration: string;
  standardId: string;

  color: string;

  selectedMaturityLevel: MaturityLevel = new MaturityLevel();

  ngOnInit(): void {
    this.initForm();

    this.evaluationId = this.data['evaluationId'];
    this.controlId = this.data['controlId'];
    this.controlName = this.data['controlName'];
    this.numeration = this.data['numeration'];
    this.standardId = this.data['standardId'];
    this.getAllMaturityLevels();
    this.getAllResponsibles();
    this.getAllDocumentations();
    this.initControlEvaluation();
  }

  initForm() {
    this.form = this._formBuilder.group({
      maturityLevel: ['', [Validators.required,]],
      responsible: ['', [Validators.required,]],
      justification: ['', [Validators.required, Validators.maxLength(500),]],
      improvementActions: ['', [Validators.required, Validators.maxLength(500),]],
      documentation: ['', [Validators.required,]],
    });
  }

  initControlEvaluation() {
    this.controlEvaluation = new ControlEvaluation();
  }


  getAllDocumentations() {
    this.documentationService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.documentations = res.data;
        console.log(res);
      }, error => {
        ErrorManager.handleError(error);
      });
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



  getFormValue() {
    if (this.form.value.maturityLevel)
      this.controlEvaluation.maturityLevelId = this.form.value.maturityLevel;
    if (this.form.value.responsible)
      this.controlEvaluation.responsibleId = this.form.value.responsible;
    this.controlEvaluation.justification = this.form.value.justification;
    this.controlEvaluation.improvementActions = this.form.value.improvementActions;
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

    this.controlEvaluation.evaluationId = Number(this.evaluationId);
    this.controlEvaluation.standardId = Number(this.standardId);
    this.controlEvaluation.controlId = Number(this.controlId);

    this.controlEvaluation.value = this.selectedMaturityLevel.value;

    let array = [];
    array = this.form.value.documentation;

    let referenceDocumentations: ReferenceDocumentation[] = [];
    array.forEach(id => {
      let model: ReferenceDocumentation = new ReferenceDocumentation();
      model.name = this.getDocumentationName(id);
      model.documentationId = id;
      model.evaluationId = Number(this.evaluationId);
      referenceDocumentations.push(model);
    });

    this.controlEvaluation.referenceDocumentations = referenceDocumentations;

    this.controlEvaluation.controlType = '';
    this.controlEvaluation.controlDescription = '';
    
    this.controlEvaluationService.insert(this.controlEvaluation)
      .subscribe(res => {
        this.controlEvaluation = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
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

    this.maturityLevels.forEach(item => {
      if (item.maturityLevelId.toString() == id) {
        this.selectedMaturityLevel = item;
        this.color = item.color;
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
