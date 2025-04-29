import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RiskTreatmentMethod } from 'app/models/risk-treatment-method';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskTreatmentMethodService } from 'app/services/risk-treatment-method.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-risk-treatment-method',
  templateUrl: './add-risk-treatment-method.component.html',
  styles: [
  ]
})


export class AddRiskTreatmentMethodComponent implements OnInit {

  constructor(
    private riskTreatmentMethodService: RiskTreatmentMethodService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRiskTreatmentMethodComponent>,

  ) { }


  riskTreatmentMethod: RiskTreatmentMethod;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initRiskTreatmentMethod();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initRiskTreatmentMethod() {
    this.riskTreatmentMethod = new RiskTreatmentMethod();
  }




  getFormValue() {
    this.riskTreatmentMethod.name = this.form.value.name;
    this.riskTreatmentMethod.description = this.form.value.description;
    if (this.form.value.description == "")
      this.riskTreatmentMethod.description = null;
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



    this.riskTreatmentMethodService.insert(this.riskTreatmentMethod)
      .subscribe(res => {
        this.riskTreatmentMethod = res.data;
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

