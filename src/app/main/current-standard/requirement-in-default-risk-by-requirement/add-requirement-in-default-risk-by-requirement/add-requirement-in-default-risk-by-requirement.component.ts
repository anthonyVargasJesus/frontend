import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RequirementInDefaultRisk } from 'app/models/requirement-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementInDefaultRiskService } from 'app/services/requirement-in-default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefaultRiskService } from 'app/services/default-risk.service';
import { DefaultRisk } from 'app/models/default-risk';

import { Requirement } from 'app/models/requirement';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-requirement-in-default-risk-by-requirement',
  templateUrl: './add-requirement-in-default-risk-by-requirement.component.html',
  styles: [
  ]
})


export class AddRequirementInDefaultRiskByRequirementComponent implements OnInit {

  constructor(
    private requirementInDefaultRiskService: RequirementInDefaultRiskService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRequirementInDefaultRiskByRequirementComponent>, private defaultRiskService: DefaultRiskService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  defaultRisks: DefaultRisk[] = [];

  requirementInDefaultRisk: RequirementInDefaultRisk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  requirementId: number;
  standardId: number;

  public title: string = 'AGREGAR RIESGO POR REQUERIMIENTO';

  ngOnInit(): void {
    this.initForm();

    this.requirementId = this.data['requirementId'];
    this.standardId = this.data['standardId'];
    this.getAllDefaultRisks();
    this.initRequirementInDefaultRisk();
  }

  initForm() {
    this.form = this._formBuilder.group({
      defaultRiskId: ['', [Validators.required,]],
      isActive: [false, [Validators.maxLength(5),]],
    });
  }

  initRequirementInDefaultRisk() {
    this.requirementInDefaultRisk = new RequirementInDefaultRisk();
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
    this.requirementInDefaultRisk.defaultRiskId = this.form.value.defaultRiskId;
    this.requirementInDefaultRisk.isActive = this.form.value.isActive;
    if (this.form.value.isActive == "")
      this.requirementInDefaultRisk.isActive = null;
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

    this.requirementInDefaultRisk.requirementId = this.requirementId;

    this.requirementInDefaultRiskService.insert(this.requirementInDefaultRisk)
      .subscribe(res => {
        this.requirementInDefaultRisk = res.data;
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

