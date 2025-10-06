import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanStatusService } from 'app/services/action-plan-status.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-action-plan-status',
  templateUrl: './add-action-plan-status.component.html',
  styles: [
  ]
})


export class AddActionPlanStatusComponent implements OnInit {

  constructor(
    private actionPlanStatusService: ActionPlanStatusService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddActionPlanStatusComponent>,

  ) { }


  actionPlanStatus: ActionPlanStatus;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initActionPlanStatus();

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

  initActionPlanStatus() {
    this.actionPlanStatus = new ActionPlanStatus();
  }




  getFormValue() {
    this.actionPlanStatus.name = this.form.value.name;
    this.actionPlanStatus.description = this.form.value.description;
    this.actionPlanStatus.abbreviation = this.form.value.abbreviation;
    this.actionPlanStatus.value = this.form.value.value;
    this.actionPlanStatus.color = this.form.value.color;
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



    this.actionPlanStatusService.insert(this.actionPlanStatus)
      .subscribe(res => {
        this.actionPlanStatus = res.data;
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

