import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ControlImplementation } from 'app/models/control-implementation';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlImplementationService } from 'app/services/control-implementation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';
import { Risk } from 'app/models/risk';
import { RiskService } from 'app/services/risk.service';

@Component({
  selector: 'app-add-control-implementation-by-risk',
  templateUrl: './add-control-implementation-by-risk.component.html',
  styles: [
  ]
})


export class AddControlImplementationByRiskComponent implements OnInit {

  riskId: number;
  selectedRisk: Risk;

  constructor(
    private controlImplementationService: ControlImplementationService,
    private _formBuilder: FormBuilder, private responsibleService: ResponsibleService,
    private dialogRef: MatDialogRef<AddControlImplementationByRiskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private riskService: RiskService,
  ) { }

  responsibles: Responsible[] = [];

  controlImplementation: ControlImplementation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.riskId = this.data['riskId'];
    this.initForm();
    this.initControlImplementation();
    this.obtainRisk();
  }

  obtainRisk() {
    this.loading = true;
    this.riskService.obtain(this.riskId.toString())
      .subscribe((res: any) => {
        this.selectedRisk = res.data;
        this.initForm();
        this.getAllResponsibles();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  initForm() {
    this.form = this._formBuilder.group({
      activities: ['', [Validators.required, Validators.maxLength(500),]],
      startDate: ['', [Validators.required,]],
      verificationDate: ['', []],
      responsibleId: ['', [Validators.required,]],
      observation: ['', [Validators.maxLength(500),]],
    });
  }

  initControlImplementation() {
    this.controlImplementation = new ControlImplementation();
  }


  getAllResponsibles() {
    // Por el momento solo se usa el ISO 27001, mas adelante se puede cambiar
    const ISO_27001_ID = 4;
    this.loading = true;
    this.responsibleService.getAll(ISO_27001_ID)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.controlImplementation.activities = this.form.value.activities;
    this.controlImplementation.startDate = this.form.value.startDate;
    this.controlImplementation.verificationDate = this.form.value.verificationDate;
    if (this.form.value.verificationDate == "")
      this.controlImplementation.verificationDate = null;
    this.controlImplementation.responsibleId = this.form.value.responsibleId;
    this.controlImplementation.observation = this.form.value.observation;
    if (this.form.value.observation == "")
      this.controlImplementation.observation = null;
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

    this.controlImplementation.riskId = this.riskId;

    this.controlImplementationService.insert(this.controlImplementation)
      .subscribe(res => {
        this.controlImplementation = res.data;
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

}

