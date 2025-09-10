import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequirementInDefaultRisk } from 'app/models/requirement-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementInDefaultRiskService } from 'app/services/requirement-in-default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefaultRiskService } from 'app/services/default-risk.service';
import { DefaultRisk } from 'app/models/default-risk';
import { DialogData } from 'app/models/dialog-data'; 


@Component({
  selector: 'app-edit-requirement-in-default-risk-by-requirement',
  templateUrl: './edit-requirement-in-default-risk-by-requirement.component.html',
  styles: [
  ]
})


export class EditRequirementInDefaultRiskByRequirementComponent implements OnInit {

  constructor(
    private requirementInDefaultRiskService: RequirementInDefaultRiskService,
    private _formBuilder: FormBuilder,
    public router: Router, private defaultRiskService: DefaultRiskService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRequirementInDefaultRiskByRequirementComponent>,

  ) { }

  defaultRisks: DefaultRisk[] = [];
  requirementId: number;
  standardId: number;

  requirementInDefaultRisk: RequirementInDefaultRisk;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR RIESGO';

  ngOnInit(): void {
    this.initRequirementInDefaultRisk();
    this.initForm();
    this.requirementId = this.data['requirementId'];
    this.standardId = this.data['standardId'];
    this.id = this.data['_id'];
    this.getAllDefaultRisks();
  }


  initRequirementInDefaultRisk() {
    this.requirementInDefaultRisk = new RequirementInDefaultRisk();
    this.initDefaultRisk();
  }
  initDefaultRisk() {
    if (this.defaultRisks.length > 0)
      this.requirementInDefaultRisk.defaultRisk = this.defaultRisks[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      defaultRiskId: ['', [Validators.required,]],
      isActive: [false, [Validators.maxLength(5),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.requirementInDefaultRiskService.obtain(id)
      .subscribe((res: any) => {
        this.requirementInDefaultRisk = res.data;
        this.setFormValue(this.requirementInDefaultRisk); 
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(requirementInDefaultRisk: RequirementInDefaultRisk) {
    this.form.setValue({
      defaultRiskId: ((requirementInDefaultRisk.defaultRiskId == null) ? '' : requirementInDefaultRisk.defaultRiskId),
      isActive: ((requirementInDefaultRisk.isActive == null) ? '' : requirementInDefaultRisk.isActive),
    });
  }

  getFormValue() {
    this.requirementInDefaultRisk.requirementInDefaultRiskId = Number(this.id);
    this.requirementInDefaultRisk.defaultRiskId = this.form.value.defaultRiskId;
    this.requirementInDefaultRisk.isActive = this.form.value.isActive;
    if (this.form.value.isActive == "")
      this.requirementInDefaultRisk.isActive = null;
  }

  getAllDefaultRisks() {
    this.loading = true;
    this.defaultRiskService.getAllBystandardId(this.standardId)
      .subscribe((res: any) => {
        this.defaultRisks = res.data;
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

    this.requirementInDefaultRiskService.update(this.requirementInDefaultRisk)
      .subscribe(res => {
        this.requirementInDefaultRisk = res.data;
        this.dialogRef.close({ updated: true });
        this.loading2 = false;
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}

