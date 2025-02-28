import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Policy } from 'app/models/policy';
import { ErrorManager } from 'app/errors/error-manager';
import { PolicyService } from 'app/services/policy.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Standard } from 'app/models/standard';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-policy-by-standard',
  templateUrl: './add-policy-by-standard.component.html',
  styles: [
  ]
})


export class AddPolicyByStandardComponent implements OnInit {

  constructor(
    private policyService: PolicyService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddPolicyByStandardComponent>, @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }


  policy: Policy;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: string;

  ngOnInit(): void {
    this.initForm();
    this.standardId = this.data['standardId'];

    this.initPolicy();

  }

  initForm() {
    this.form = this._formBuilder.group({
      isCurrent: [false, [Validators.required, Validators.maxLength(5),]],
      date: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initPolicy() {
    this.policy = new Policy();
  }




  getFormValue() {
    this.policy.isCurrent = this.form.value.isCurrent;
    this.policy.date = this.form.value.date;
    this.policy.name = this.form.value.name;
    this.policy.description = this.form.value.description;
    if (this.form.value.description == "")
      this.policy.description = null;
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

    this.policy.standardId = Number(this.standardId);

    this.policyService.insert(this.policy)
      .subscribe(res => {
        this.policy = res.data;
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

