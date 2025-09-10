import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MaturityLevel } from 'app/models/maturity-level';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { LoginService } from 'app/services/login.service';
import { generateNumericId, getReferenceDocsKey } from 'app/config/config';
// import { AddResponsibleComponent } from '../../responsible/add-responsible/add-responsible.component';
// import { AddDocumentationComponent } from '../../documentation/add-documentation/add-documentation.component';


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
  ) { }

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];

  requirementEvaluation: RequirementEvaluation = new RequirementEvaluation();
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
  private panelClass: string;
  requirementEvaluationId: number;
  evidencesIsUpdated: boolean = false;

  ngOnInit(): void {

    this.requirementEvaluationId = generateNumericId();
    this.initForm();
    this.evaluationId = this.data['evaluationId'];
    this.requirementId = this.data['requirementId'];
    this.requirementName = this.data['requirementName'];
    this.numeration = this.data['numeration'];
    this.standardId = this.data['standardId'];
    this.panelClass = this.data['panelClass'];
    this.getAllResponsibles();
  }


  initForm() {
    this.form = this._formBuilder.group({
      maturityLevel: ['', [Validators.required,]],
      responsible: ['', [Validators.required,]],
      justification: ['', [Validators.required, Validators.maxLength(500),]],
      improvementActions: ['', [Validators.maxLength(1000),]],
    });
  }

  initRequirementEvaluation() {
    this.requirementEvaluation = new RequirementEvaluation();
  }

  getAllMaturityLevels() {
    this.loading = true;
    this.maturityLevelService.getAll()
      .subscribe((res: any) => {
        this.maturityLevels = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getAllResponsibles() {
    this.loading = true;
    this.responsibleService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.loading = false;
        this.getAllMaturityLevels();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    if (this.form.value.maturityLevel)
      this.requirementEvaluation.maturityLevelId = Number(this.form.value.maturityLevel);
    if (this.form.value.responsible)
      this.requirementEvaluation.responsibleId = Number(this.form.value.responsible);
    this.requirementEvaluation.justification = this.form.value.justification;
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
    this.requirementEvaluation.referenceDocumentations = this.getReferenceDocumentationsFromLocalStorage();

    this.requirementEvaluationService.insert(this.requirementEvaluation)
      .subscribe(res => {
        this.requirementEvaluation = res.data;
         let LS_KEY = getReferenceDocsKey(0, this.requirementEvaluationId);
        localStorage.removeItem(LS_KEY);

        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  getReferenceDocumentationsFromLocalStorage() {

    let LS_KEY = getReferenceDocsKey(0, this.requirementEvaluationId);
    const stored = localStorage.getItem(LS_KEY);

    const references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];

    return references;
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

    // if (this.loginService.isAuthenticated()) {
    //   let dialogRef = this.dialog.open(AddResponsibleComponent, {
    //     height: '600px',
    //     width: '600px',
    //     autoFocus: false,
    //     data: {
    //       standardId: this.standardId
    //     },
    //     panelClass: this.panelClass
    //   });

    //   dialogRef.afterClosed().subscribe(data => {
    //     if (data == null)
    //       return;

    //     if (data.updated == true)
    //       this.getAllResponsibles();

    //   });
    // }

  }

  addDocumentation() {

    // if (this.loginService.isAuthenticated()) {
    //   let dialogRef = this.dialog.open(AddDocumentationComponent, {
    //     height: '600px',
    //     width: '600px',
    //     autoFocus: false,
    //     data: {
    //       standardId: this.standardId
    //     },
    //     panelClass: this.panelClass
    //   });

    //   dialogRef.afterClosed().subscribe(data => {
    //     if (data == null)
    //       return;

    //     if (data.updated == true)
    //       this.getAllDocumentations();
    //   });
    // }


  }


  updateList(event: any) {
    this.evidencesIsUpdated = true;
  }

  close() {
    this.dialogRef.close({ updated: this.evidencesIsUpdated });
  }

}

