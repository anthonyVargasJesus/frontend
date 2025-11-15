import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Breach } from 'app/models/breach';
import { ErrorManager } from 'app/errors/error-manager';
import { BreachService } from 'app/services/breach.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Requirement } from 'app/models/requirement';
import { Control } from 'app/models/control';
import { BreachSeverityService } from 'app/services/breach-severity.service';
import { BreachSeverity } from 'app/models/breach-severity';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';
import { LoginService } from 'app/services/login.service';
import { PopupRequirementsComponent } from '../../popup-requirements/popup-requirements.component';
import { PopupControlsComponent } from '../../popup-controls/popup-controls.component';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';


@Component({
  selector: 'app-edit-breach-by-evaluation',
  templateUrl: './edit-breach-by-evaluation.component.html',
  styles: [
  ]
})


export class EditBreachByEvaluationComponent implements OnInit {

  constructor(
    private breachService: BreachService,
    private _formBuilder: FormBuilder,
    public router: Router,
    private loginService: LoginService,
    private breachSeverityService: BreachSeverityService,
    private responsibleService: ResponsibleService,
    private dialog: MatDialog,
    private _coreConfigService: CoreConfigService,
    private route: ActivatedRoute,
  ) { }

  selectedRequirement: Requirement = new Requirement();
  selectedControl: Control = new Control();

  breachSeverities: BreachSeverity[] = [];
  responsibles: Responsible[] = [];



  breach: Breach;
  loading = false;
  id: string;
  standardId: number;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR BRECHA';
  type: string = '';

  popuIsOpen = false;
  //panelClass: any;

  public contentHeader: object;

  evaluationId: number;

  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  ngOnInit(): void {
    this.initBreach();
    this.initForm();
    this.initMenuName();
    this.getTheme();
    //this.standardId = this.data['standardId'];
    //this.id = this.data['_id'];
    //this.panelClass = this.data['panelClass'];

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('breachId').toString();
      this.standardId = Number(params.get('standardId').toString());
      this.getAllBreachSeverities();
    });

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
    
  initMenuName() {

    this.contentHeader = {
      headerTitle: 'Brechas encontradas',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'BRECHAS',
            isLink: false,
            link: '#'
          },
          {
            name: 'Requisitos',
            isLink: false
          },
        ]
      }
    }
  }

  initBreach() {
    this.breach = new Breach();
  }

  initForm() {
    this.form = this._formBuilder.group({
      type: ['', [Validators.maxLength(20),]],
      requirement: ['', [Validators.required,]],
      control: ['', [Validators.required,]],
      title: ['', [Validators.required, Validators.maxLength(150),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      breachSeverityId: ['', [Validators.required,]],
      responsibleId: ['', [Validators.required,]],
      evidenceDescription: ['', [Validators.maxLength(300),]],
    });

    this.form.get('requirement')?.setValidators([Validators.required]);
    this.form.get('control')?.clearValidators();
    // Muy importante: actualizar validadores
    this.form.get('requirement')?.updateValueAndValidity();
    this.form.get('control')?.updateValueAndValidity();

    this.form.get('type')?.valueChanges.subscribe(value => {

      this.type = value;

      if (value === '1') { // Requerimiento
        this.form.get('requirement')?.setValidators([Validators.required]);
        this.form.get('control')?.clearValidators();
      } else if (value === '2') { // Control
        this.form.get('control')?.setValidators([Validators.required]);
        this.form.get('requirement')?.clearValidators();
      } else {
        // Si no selecciona nada, ambos sin validadores
        this.form.get('requirement')?.clearValidators();
        this.form.get('control')?.clearValidators();
      }

      // Muy importante: actualizar validadores
      this.form.get('requirement')?.updateValueAndValidity();
      this.form.get('control')?.updateValueAndValidity();

    });

  }

  obtain(id: string) {
    this.loading = true;
    this.breachService.obtain(id)
      .subscribe((res: any) => {
        this.breach = res.data;
        this.evaluationId = this.breach.evaluationId;
        this.setFormValue(this.breach);
        this.type = this.breach.type;
        this.title = this.breach.title.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(breach: Breach) {

    this.form.setValue({
      type: ((breach.type == null) ? '' : breach.type),
      requirement: ((breach.requirement == null) ? '' : breach.numerationToShow + ' ' + breach.requirement.name),
      control: ((breach.control == null) ? '' : breach.numerationToShow + ' ' + breach.control.name),
      title: ((breach.title == null) ? '' : breach.title),
      description: ((breach.description == null) ? '' : breach.description),
      breachSeverityId: ((breach.breachSeverityId == null) ? '' : breach.breachSeverityId),
      responsibleId: ((breach.responsibleId == null) ? '' : breach.responsibleId),
      evidenceDescription: ((breach.evidenceDescription == null) ? '' : breach.evidenceDescription),
    });

    const REQUIREMENT_TYPE = '1'
    if (this.breach.type == REQUIREMENT_TYPE)
      this.selectedRequirement = this.breach.requirement;
    else
      this.selectedControl = this.breach.control;

  }

  getFormValue() {
    this.breach.type = this.form.value.type;
    if (this.form.value.type == "")
      this.breach.type = null;
    this.breach.title = this.form.value.title;
    this.breach.description = this.form.value.description;
    this.breach.breachSeverityId = Number(this.form.value.breachSeverityId);
    this.breach.responsibleId = Number(this.form.value.responsibleId);
    this.breach.evidenceDescription = this.form.value.evidenceDescription;
    if (this.form.value.evidenceDescription == "")
      this.breach.evidenceDescription = null;
  }

  getAllBreachSeverities() {
    this.loading = true;
    this.breachSeverityService.getAll()
      .subscribe((res: any) => {
        this.breachSeverities = res.data;
        this.loading = false;
        this.getAllResponsibles();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getAllResponsibles() {
    this.loading = true;
    this.responsibleService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.loading = false;
        this.obtain(this.id);
      }, error => {
        this.loading = false;
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

    const REQUIREMENT_TYPE = '1'
    if (this.breach.type == REQUIREMENT_TYPE) {
      this.breach.requirementId = this.selectedRequirement.requirementId;
      this.breach.controlId = 0;
      if (this.popuIsOpen)
        this.breach.numerationToShow = this.selectedRequirement.numerationToShow;
    }
    else {
      this.breach.controlId = this.selectedControl.controlId;
      this.breach.requirementId = 0;
      if (this.popuIsOpen)
        this.breach.numerationToShow = this.selectedControl.numerationToShow;
    }

    this.breachService.update(this.breach)
      .subscribe(res => {
        this.breach = res.data;
        this.loading2 = false;
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  navigateToBack() {
    this.router.navigate(['/gap/current-breachs']);
  }

  openRequirements() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(PopupRequirementsComponent, {
        height: '700px',
        width: '800px',
        data: {
          standardId: this.standardId,
        },
        autoFocus: false,
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.requirement) {

          this.selectedRequirement = data.requirement;
          this.selectedControl = undefined;

          this.popuIsOpen = true;

          this.form.patchValue({
            requirement: this.selectedRequirement.numerationToShow + ' . ' + this.selectedRequirement.name,
            control: ''
          });

        }

      });
    }

  }

  openControls() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(PopupControlsComponent, {
        height: '700px',
        width: '800px',
        data: {
          standardId: this.standardId,
        },
        autoFocus: false,
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.control) {

          this.selectedControl = data.control;
          this.selectedRequirement = undefined;

          this.popuIsOpen = true;

          this.form.patchValue({
            control: this.selectedControl.numerationToShow + ' . ' + this.selectedControl.name,
            requirement: ''
          });

        }

      });
    }

  }

}

