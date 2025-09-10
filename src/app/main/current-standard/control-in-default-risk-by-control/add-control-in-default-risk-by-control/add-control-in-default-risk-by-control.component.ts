import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ControlInDefaultRisk } from 'app/models/control-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlInDefaultRiskService } from 'app/services/control-in-default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefaultRiskService } from 'app/services/default-risk.service';
import { DefaultRisk } from 'app/models/default-risk';

import { Control } from 'app/models/control';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-control-in-default-risk-by-control',
  templateUrl: './add-control-in-default-risk-by-control.component.html',
  styles: [
  ]
})


export class AddControlInDefaultRiskByControlComponent implements OnInit {

  constructor(
    private controlInDefaultRiskService: ControlInDefaultRiskService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddControlInDefaultRiskByControlComponent>, private defaultRiskService: DefaultRiskService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  defaultRisks: DefaultRisk[] = [];

  controlInDefaultRisk: ControlInDefaultRisk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  controlId: number;
  standardId: number;

  ngOnInit(): void {
    this.initForm();
    this.initControlInDefaultRisk();
    this.controlId = this.data['controlId'];
    this.standardId = this.data['standardId'];
    this.getAllDefaultRisks();
  }

  initForm() {
    this.form = this._formBuilder.group({
      defaultRiskId: ['', [Validators.required,]],
      isActive: [false, [Validators.maxLength(5),]],
    });
  }

  initControlInDefaultRisk() {
    this.controlInDefaultRisk = new ControlInDefaultRisk();
  }

  getAllDefaultRisks() {
    this.loading = true;
    this.defaultRiskService.getAllBystandardId(this.standardId)
      .subscribe((res: any) => {
        this.defaultRisks = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.controlInDefaultRisk.defaultRiskId = this.form.value.defaultRiskId;
    this.controlInDefaultRisk.isActive = this.form.value.isActive;
    if (this.form.value.isActive == "")
      this.controlInDefaultRisk.isActive = null;
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

    this.controlInDefaultRisk.controlId = this.controlId;

    this.controlInDefaultRiskService.insert(this.controlInDefaultRisk)
      .subscribe(res => {
        this.controlInDefaultRisk = res.data;
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

