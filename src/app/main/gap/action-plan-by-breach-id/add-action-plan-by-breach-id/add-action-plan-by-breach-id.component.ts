import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ActionPlan } from 'app/models/action-plan';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanService } from 'app/services/action-plan.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { ActionPlanStatusService } from 'app/services/action-plan-status.service';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ActionPlanPriorityService } from 'app/services/action-plan-priority.service';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-action-plan-by-breach-id',
  templateUrl: './add-action-plan-by-breach-id.component.html',
  styles: [
  ]
})


export class AddActionPlanByBreachIdComponent implements OnInit {

  constructor(
    private actionPlanService: ActionPlanService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddActionPlanByBreachIdComponent>, private responsibleService: ResponsibleService,
    private actionPlanStatusService: ActionPlanStatusService,
    private actionPlanPriorityService: ActionPlanPriorityService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  responsibles: Responsible[] = [];
  actionPlanStatuss: ActionPlanStatus[] = [];
  actionPlanPriorities: ActionPlanPriority[] = [];

  actionPlan: ActionPlan;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  breachId: number;
  standardId: number;
  evaluationId: number;

  ngOnInit(): void {
    this.initForm();
    this.initActionPlan();
    this.breachId = this.data['breachId'];
    this.evaluationId = this.data['evaluationId'];
    this.standardId = this.data['standardId'];
    this.getAllResponsibles();
  }

  initForm() {
    this.form = this._formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(150),]],
      description: ['', [Validators.maxLength(300),]],
      responsibleId: ['', [Validators.required,]],
      startDate: ['', [Validators.required,]],
      dueDate: ['', [Validators.required,]],
      actionPlanPriorityId: ['', [Validators.required,]],
    });
  }

  initActionPlan() {
    this.actionPlan = new ActionPlan();
  }



  getAllResponsibles() {
    this.loading = true;
    this.responsibleService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.loading = false;
        this.getAllActionPlanStatuss();

      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  getAllActionPlanStatuss() {
    this.loading = true;
    this.actionPlanStatusService.getAll()
      .subscribe((res: any) => {
        this.actionPlanStatuss = res.data;
        this.loading = false;
        this.getAllActionPlanPriorities();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  getAllActionPlanPriorities() {
    this.loading = true;
    this.actionPlanPriorityService.getAll()
      .subscribe((res: any) => {
        this.actionPlanPriorities = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.actionPlan.title = this.form.value.title;
    this.actionPlan.description = this.form.value.description;
    if (this.form.value.description == "")
      this.actionPlan.description = null;
    this.actionPlan.responsibleId = this.form.value.responsibleId;
    this.actionPlan.startDate = this.form.value.startDate;
    this.actionPlan.dueDate = this.form.value.dueDate;
    this.actionPlan.actionPlanPriorityId = this.form.value.actionPlanPriorityId;
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

    this.actionPlan.breachId = this.breachId;
    this.actionPlan.evaluationId = this.evaluationId;
    this.actionPlan.standardId = this.standardId;

    this.actionPlanService.insert(this.actionPlan)
      .subscribe(res => {
        this.actionPlan = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}
