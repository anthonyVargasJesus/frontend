import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RiskStatus } from 'app/models/risk-status';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskStatusService } from 'app/services/risk-status.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-risk-status',
  templateUrl: './add-risk-status.component.html',
  styles: [
  ]
})


export class AddRiskStatusComponent implements OnInit {

  constructor(
    private riskStatusService: RiskStatusService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRiskStatusComponent>,

  ) { }


  riskStatus: RiskStatus;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initRiskStatus();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initRiskStatus() {
    this.riskStatus = new RiskStatus();
  }




  getFormValue() {
    this.riskStatus.name = this.form.value.name;
    this.riskStatus.description = this.form.value.description;
    this.riskStatus.abbreviation = this.form.value.abbreviation;
    this.riskStatus.value = this.form.value.value;
    this.riskStatus.color = this.form.value.color;
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



    this.riskStatusService.insert(this.riskStatus)
      .subscribe(res => {
        this.riskStatus = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } close() {
    this.dialogRef.close();
  }
}

