import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MaturityLevel } from 'app/models/maturity-level';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';
import { Console } from 'console';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { LoginService } from 'app/services/login.service';
import { AddResponsibleComponent } from '../../responsible/add-responsible/add-responsible.component';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AddDocumentationComponent } from '../../documentation/add-documentation/add-documentation.component';


@Component({
  selector: 'app-edit-requirement-evaluation',
  templateUrl: './edit-requirement-evaluation.component.html',
  styles: [
  ]
})
export class EditRequirementEvaluationComponent implements OnInit {

  constructor(
    private requirementEvaluationService: RequirementEvaluationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private maturityLevelService: MaturityLevelService,
    private responsibleService: ResponsibleService,
    private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRequirementEvaluationComponent>,
    private loginService: LoginService,
    private dialog: MatDialog,
    private _coreConfigService: CoreConfigService,
  ) { }

  maturityLevels: MaturityLevel[] = [];
  responsibles: Responsible[] = [];
  documentations: Documentation[] = [];
  requirementEvaluation: RequirementEvaluation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  requirementName: string;
  numeration: string;
  public submitted = false;
  public last: string = '';
  standardId: string;

  selectedMaturityLevel: MaturityLevel = new MaturityLevel();


  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  ngOnInit(): void {

    this.getTheme();
    this.initForm();
  
    this.initRequirementEvaluation();
    this.id = this.data['_id'];
    this.standardId = this.data['standardId'];
    this.requirementName = this.data['requirementName'];
    this.numeration = this.data['numeration'];
    this.getAllResponsibles();
    this.getAllDocumentations();
    this.getAllMaturityLevels();
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

  initRequirementEvaluation() {
    this.requirementEvaluation = new RequirementEvaluation();
  }



  initForm() {
    this.form = this._formBuilder.group({
      maturityLevel: ['', [Validators.required,]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
      responsible: ['', [Validators.required,]],
      justification: ['', [Validators.required, Validators.maxLength(500),]],
      improvementActions: ['', [Validators.maxLength(500),]],
      documentation: ['', [Validators.required,]],
    });
  }

  getAllDocumentations() {
    this.documentationService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.documentations = res.data;
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  obtain(id: string) {
    this.loading = true;
    this.requirementEvaluationService.obtain(id)
      .subscribe((res: any) => {
        this.requirementEvaluation = res.data;
        this.setFormValue(this.requirementEvaluation);
        this.changeMaturityLevel(this.requirementEvaluation.maturityLevelId.toString());
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(requirementEvaluation: RequirementEvaluation) {
    this.form.setValue({
      maturityLevel: ((requirementEvaluation.maturityLevelId == null) ? '' : requirementEvaluation.maturityLevelId),
      value: ((requirementEvaluation.value == null) ? '' : requirementEvaluation.value),
      responsible: ((requirementEvaluation.responsibleId == null) ? '' : requirementEvaluation.responsibleId),
      justification: ((requirementEvaluation.justification == null) ? '' : requirementEvaluation.justification),
      improvementActions: ((requirementEvaluation.improvementActions == null) ? '' : requirementEvaluation.improvementActions),
      documentation: requirementEvaluation.arrayReferenceDocumentations
    });


  }


  getFormValue() {
    this.requirementEvaluation.requirementEvaluationId = Number(this.id);
    if (this.form.value.maturityLevel)
      this.requirementEvaluation.maturityLevelId = this.form.value.maturityLevel;
    if (this.form.value.responsible)
      this.requirementEvaluation.responsibleId = this.form.value.responsible;
    this.requirementEvaluation.justification = this.form.value.justification;
    this.requirementEvaluation.improvementActions = this.form.value.improvementActions;
  }


  getAllMaturityLevels() {
    this.maturityLevelService.getAll()
      .subscribe((res: any) => {
        this.maturityLevels = res.data;
        this.initRequirementEvaluation();
        this.obtain(this.id);
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


  get f() {
    return this.form.controls;
  }


  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.requirementEvaluation.value = this.selectedMaturityLevel.value;

    let array = [];
    array = this.form.value.documentation;

    let referenceDocumentations: ReferenceDocumentation[] = [];
    array.forEach(id => {
      let model: ReferenceDocumentation = new ReferenceDocumentation();
      model.name = this.getDocumentationName(id);
      model.documentationId = id;
      model.evaluationId = Number(this.requirementEvaluation.evaluationId);
      referenceDocumentations.push(model);
    });

    this.requirementEvaluation.referenceDocumentations = referenceDocumentations;
    

    this.requirementEvaluationService.update(this.requirementEvaluation)
      .subscribe(res => {
        this.requirementEvaluation = res.data;
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
    console.log('Closing dialog');
    this.dialogRef.close();
  }


}
