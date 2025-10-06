import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  selector: 'app-edit-action-plan-by-breach-id',
  templateUrl: './edit-action-plan-by-breach-id.component.html',
  styles: [
  ]
})


export class EditActionPlanByBreachIdComponent implements OnInit {

  constructor(
    private actionPlanService: ActionPlanService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private responsibleService: ResponsibleService,
    private actionPlanStatusService: ActionPlanStatusService,
    private actionPlanPriorityService: ActionPlanPriorityService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditActionPlanByBreachIdComponent>,

  ) { }

  responsibles: Responsible[] = [];
  actionPlanStatuss: ActionPlanStatus[] = [];
  actionPlanPriorities: ActionPlanPriority[] = [];

  actionPlan: ActionPlan;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR PLAN DE ACCIÓN';

  standardId: number;

  ngOnInit(): void {
        this.id = this.data['_id'];
    this.standardId = this.data['standardId'];
    this.initForm();
    this.getAllResponsibles();
    this.initActionPlan();
  }

  initActionPlan() {
    this.actionPlan = new ActionPlan();
  }


  initForm() {
    this.form = this._formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(150),]],
      description: ['', [Validators.maxLength(300),]],
      responsibleId: ['', [Validators.required,]],
      startDate: ['', [Validators.required,]],
      dueDate: ['', [Validators.required,]],
      actionPlanStatusId: ['', [Validators.required,]],
      actionPlanPriorityId: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.actionPlanService.obtain(id)
      .subscribe((res: any) => {
        this.actionPlan = res.data;
        this.setFormValue(this.actionPlan);
        this.title = this.actionPlan.title.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(actionPlan: ActionPlan) {
    this.form.setValue({
      title: ((actionPlan.title == null) ? '' : actionPlan.title),
      description: ((actionPlan.description == null) ? '' : actionPlan.description),
      responsibleId: ((actionPlan.responsibleId == null) ? '' : actionPlan.responsibleId),
      startDate: ((actionPlan.startDate == null) ? '' : actionPlan.startDate),
      dueDate: ((actionPlan.dueDate == null) ? '' : actionPlan.dueDate),
      actionPlanStatusId: ((actionPlan.actionPlanStatusId == null) ? '' : actionPlan.actionPlanStatusId),
      actionPlanPriorityId: ((actionPlan.actionPlanPriorityId == null) ? '' : actionPlan.actionPlanPriorityId),
    });
  }


  getFormValue() {
    this.actionPlan.actionPlanId = Number(this.id);
    this.actionPlan.title = this.form.value.title;
    this.actionPlan.description = this.form.value.description;
    if (this.form.value.description == "")
      this.actionPlan.description = null;
    this.actionPlan.responsibleId = this.form.value.responsibleId;
    this.actionPlan.startDate = this.form.value.startDate;
    this.actionPlan.dueDate = this.form.value.dueDate;
    this.actionPlan.actionPlanStatusId = this.form.value.actionPlanStatusId;
    this.actionPlan.actionPlanPriorityId = this.form.value.actionPlanPriorityId;
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



    this.actionPlanService.update(this.actionPlan)
      .subscribe(res => {
        this.actionPlan = res.data;
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
