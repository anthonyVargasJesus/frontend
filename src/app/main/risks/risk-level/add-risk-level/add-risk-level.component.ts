import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RiskLevel } from 'app/models/risk-level';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskLevelService } from 'app/services/risk-level.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-risk-level',
  templateUrl: './add-risk-level.component.html',
  styles: [
  ]
})


export class AddRiskLevelComponent implements OnInit {

  constructor(
    private riskLevelService: RiskLevelService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRiskLevelComponent>,

  ) { }


  riskLevel: RiskLevel;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initRiskLevel();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      factor: ['', [Validators.maxLength(8),]],
      minimum: ['', [Validators.required, Validators.maxLength(8),]],
      maximum: ['', [Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initRiskLevel() {
    this.riskLevel = new RiskLevel();
  }




  getFormValue() {
    this.riskLevel.name = this.form.value.name;
    this.riskLevel.description = this.form.value.description;
    this.riskLevel.abbreviation = this.form.value.abbreviation;
    this.riskLevel.factor = this.form.value.factor;
    this.riskLevel.minimum = this.form.value.minimum;
    this.riskLevel.maximum = this.form.value.maximum;
    this.riskLevel.color = this.form.value.color;

    if (this.form.value.minimum == "")
      this.riskLevel.minimum = null;
    if (this.form.value.maximum == "")
      this.riskLevel.maximum = null;
    if (this.form.value.factor == "")
      this.riskLevel.factor = null;

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



    this.riskLevelService.insert(this.riskLevel)
      .subscribe(res => {
        this.riskLevel = res.data;
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

