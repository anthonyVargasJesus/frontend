import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanPriorityService } from 'app/services/action-plan-priority.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-action-plan-priority',
  templateUrl: './add-action-plan-priority.component.html',
  styles: [
  ]
})


export class AddActionPlanPriorityComponent implements OnInit {

  constructor(
    private actionPlanPriorityService: ActionPlanPriorityService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddActionPlanPriorityComponent>,

  ) { }


  actionPlanPriority: ActionPlanPriority;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initActionPlanPriority();

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

  initActionPlanPriority() {
    this.actionPlanPriority = new ActionPlanPriority();
  }




  getFormValue() {
    this.actionPlanPriority.name = this.form.value.name;
    this.actionPlanPriority.description = this.form.value.description;
    this.actionPlanPriority.abbreviation = this.form.value.abbreviation;
    this.actionPlanPriority.value = this.form.value.value;
    this.actionPlanPriority.color = this.form.value.color;
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



    this.actionPlanPriorityService.insert(this.actionPlanPriority)
      .subscribe(res => {
        this.actionPlanPriority = res.data;
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

