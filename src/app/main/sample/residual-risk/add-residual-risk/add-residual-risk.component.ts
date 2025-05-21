import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ResidualRisk } from 'app/models/residual-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ResidualRiskService } from 'app/services/residual-risk.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-residual-risk',
  templateUrl: './add-residual-risk.component.html',
  styles: [
  ]
})


export class AddResidualRiskComponent implements OnInit {

  constructor(
    private residualRiskService: ResidualRiskService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddResidualRiskComponent>,

  ) { }


  residualRisk: ResidualRisk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initResidualRisk();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      factor: ['', [Validators.maxLength(5),]],
      minimum: ['', [Validators.maxLength(5),]],
      maximum: ['', [Validators.maxLength(5),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initResidualRisk() {
    this.residualRisk = new ResidualRisk();
  }




  getFormValue() {
    this.residualRisk.name = this.form.value.name;
    this.residualRisk.description = this.form.value.description;
    if (this.form.value.description == "")
      this.residualRisk.description = null;
    this.residualRisk.abbreviation = this.form.value.abbreviation;
    this.residualRisk.factor = this.form.value.factor;
    if (this.form.value.factor == "")
      this.residualRisk.factor = null;
    this.residualRisk.minimum = this.form.value.minimum;
    if (this.form.value.minimum == "")
      this.residualRisk.minimum = null;
    this.residualRisk.maximum = this.form.value.maximum;
    if (this.form.value.maximum == "")
      this.residualRisk.maximum = null;
    this.residualRisk.color = this.form.value.color;
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



    this.residualRiskService.insert(this.residualRisk)
      .subscribe(res => {
        this.residualRisk = res.data;
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

