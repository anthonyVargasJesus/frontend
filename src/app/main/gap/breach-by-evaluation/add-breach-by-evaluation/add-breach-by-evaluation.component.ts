import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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


@Component({
  selector: 'app-add-breach-by-evaluation',
  templateUrl: './add-breach-by-evaluation.component.html',
  styles: [
  ]
})


export class AddBreachByEvaluationComponent implements OnInit {

  constructor(
    private breachService: BreachService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddBreachByEvaluationComponent>,
    private loginService: LoginService,
    private breachSeverityService: BreachSeverityService,
    private responsibleService: ResponsibleService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialog: MatDialog,
  ) { }

  selectedRequirement: Requirement = new Requirement();
  selectedControl: Control = new Control();

  breachSeverities: BreachSeverity[] = [];
  responsibles: Responsible[] = [];

  breach: Breach;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  evaluationId: number;
  standardId: number;

  type: string = '1';
  panelClass: any;

  ngOnInit(): void {
    this.initForm();
    this.evaluationId = this.data['evaluationId'];
    this.standardId = this.data['standardId'];
    this.panelClass = this.data['panelClass'];

    this.initBreach();
    this.getAllBreachSeverities();
  }

  initForm() {
    this.form = this._formBuilder.group({
      type: [this.type, [Validators.maxLength(20),]],
      requirement: [''],
      control: [''],
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

  initBreach() {
    this.breach = new Breach();
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
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
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

  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.breach.evaluationId = this.evaluationId;

    const REQUIREMENT_TYPE = '1'
    if (this.breach.type == REQUIREMENT_TYPE) {
      this.breach.requirementId = this.selectedRequirement.requirementId;
      this.breach.numerationToShow = this.selectedRequirement.numerationToShow;
    }
    else {
      this.breach.controlId = this.selectedControl.controlId;
      this.breach.numerationToShow = this.selectedControl.numerationToShow;
    }

    this.breach.standardId = this.standardId;

    this.breachService.insert(this.breach)
      .subscribe(res => {
        this.breach = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
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

          this.form.patchValue({
            control: this.selectedControl.numerationToShow + ' . ' + this.selectedControl.name,
            requirement: ''
          });

        }

      });
    }

  }


}

