import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MaturityLevel } from 'app/models/maturity-level';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { Evaluation } from 'app/models/evaluation';
import { Requirement } from 'app/models/requirement';
import { DialogData } from 'app/models/dialog-data';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { Subject } from 'rxjs/internal/Subject';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AddResponsibleComponent } from '../../responsible/add-responsible/add-responsible.component';
import { AddDocumentationComponent } from '../../documentation/add-documentation/add-documentation.component';


@Component({
  selector: 'app-add-requirement-evaluation',
  templateUrl: './add-requirement-evaluation.component.html',
  styles: [
  ]
})
export class AddRequirementEvaluationComponent implements OnInit {

  constructor(
    private requirementEvaluationService: RequirementEvaluationService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRequirementEvaluationComponent>,
    private maturityLevelService: MaturityLevelService,
    private responsibleService: ResponsibleService,
    private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private loginService: LoginService,
    private dialog: MatDialog,
    private _coreConfigService: CoreConfigService,
  ) { }

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  documentations: Documentation[] = [];

  requirementEvaluation: RequirementEvaluation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  evaluationId: number;
  requirementId: string;
  requirementName: string;
  numeration: string;
  standardId: string;

  color: string;

  selectedMaturityLevel: MaturityLevel = new MaturityLevel();

  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  requirementEvaluationId: string;


  ngOnInit(): void {

    this.requirementEvaluationId = this.generateNumericId();
    console.log('requirementEvaluationId', this.requirementEvaluationId);
    this.initForm();
    this.evaluationId = this.data['evaluationId'];
    this.requirementId = this.data['requirementId'];
    this.requirementName = this.data['requirementName'];
    this.numeration = this.data['numeration'];
    this.standardId = this.data['standardId'];

    this.getAllMaturityLevels();
    this.getAllResponsibles();
    this.getAllDocumentations();
    this.initRequirementEvaluation();
  }

  generateNumericId(): string {
    const timestamp = Date.now().toString(); // milisegundos
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // 6 dígitos aleatorios
    return timestamp + random;
  }

  getTheme() {
    this._unsubscribeAll = new Subject();
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.currentSkin = config.layout.skin;
        this.setDialogContainerStyle();
      });
  }

  setDialogContainerStyle() {
    if (this.currentSkin == 'dark')
      this.panelClass = 'custom-dark-dialog-container';
    else
      this.panelClass = 'custom-default-dialog-container';
  }

  initForm() {
    this.form = this._formBuilder.group({
      maturityLevel: ['', [Validators.required,]],
      responsible: ['', [Validators.required,]],
      //justification: ['', [Validators.required, Validators.maxLength(500),]],
      improvementActions: ['', [Validators.maxLength(500),]],
      documentation: ['', [Validators.required,]],
    });
  }

  initRequirementEvaluation() {
    this.requirementEvaluation = new RequirementEvaluation();
  }


  getAllDocumentations() {
    this.documentationService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.documentations = res.data;
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getAllMaturityLevels() {
    this.maturityLevelService.getAll()
      .subscribe((res: any) => {
        this.maturityLevels = res.data;
        this.initRequirementEvaluation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllResponsibles() {
    this.responsibleService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.responsibles = res.data;
        //this.initRequirementEvaluation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    if (this.form.value.maturityLevel)
      this.requirementEvaluation.maturityLevelId = this.form.value.maturityLevel;
    if (this.form.value.responsible)
      this.requirementEvaluation.responsibleId = this.form.value.responsible;
    //this.requirementEvaluation.justification = this.form.value.justification;
    this.requirementEvaluation.improvementActions = this.form.value.improvementActions;
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

    this.requirementEvaluation.evaluationId = Number(this.evaluationId);
    this.requirementEvaluation.standardId = Number(this.standardId);
    this.requirementEvaluation.requirementId = Number(this.requirementId);
    this.requirementEvaluation.value = this.selectedMaturityLevel.value;

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

    this.requirementEvaluation.referenceDocumentations = referenceDocumentations;

    this.requirementEvaluationService.insert(this.requirementEvaluation)
      .subscribe(res => {
        this.requirementEvaluation = res.data;
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

  addResponsible() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddResponsibleComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false,
        data: {
          standardId: this.standardId
        },
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.getAllResponsibles();

      });
    }

  }

  addDocumentation() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddDocumentationComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false,
        data: {
          standardId: this.standardId
        },
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.getAllDocumentations();
      });
    }


  }


  close() {
    this.dialogRef.close();
  }

}

