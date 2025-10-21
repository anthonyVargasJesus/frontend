import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ImpactValuation } from 'app/models/impact-valuation';
import { ErrorManager } from 'app/errors/error-manager';
import { ImpactValuationService } from 'app/services/impact-valuation.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-impact-valuation',
  templateUrl: './add-impact-valuation.component.html',
  styles: [
  ]
})


export class AddImpactValuationComponent implements OnInit {

  constructor(
    private impactValuationService: ImpactValuationService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddImpactValuationComponent>,

  ) { }


  impactValuation: ImpactValuation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initImpactValuation();

  }

  initForm() {
    this.form = this._formBuilder.group({
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      minimumValue: ['', [Validators.maxLength(8),]],
      maximumValue: ['', [Validators.maxLength(8),]],
      defaultValue: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  initImpactValuation() {
    this.impactValuation = new ImpactValuation();
  }




  getFormValue() {
    this.impactValuation.abbreviation = this.form.value.abbreviation;
    this.impactValuation.name = this.form.value.name;
    this.impactValuation.minimumValue = this.form.value.minimumValue;
    this.impactValuation.maximumValue = this.form.value.maximumValue;
    this.impactValuation.defaultValue = this.form.value.defaultValue;

    if (this.form.value.minimumValue == "")
      this.impactValuation.minimumValue = null;
    if (this.form.value.maximumValue == "")
      this.impactValuation.maximumValue = null;

    
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



    this.impactValuationService.insert(this.impactValuation)
      .subscribe(res => {
        this.impactValuation = res.data;
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
