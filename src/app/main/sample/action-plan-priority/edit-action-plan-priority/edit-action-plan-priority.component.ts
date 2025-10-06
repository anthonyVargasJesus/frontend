import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionPlanPriority } from 'app/models/action-plan-priority';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanPriorityService } from 'app/services/action-plan-priority.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-action-plan-priority',
  templateUrl: './edit-action-plan-priority.component.html',
  styles: [
  ]
})

export class EditActionPlanPriorityComponent implements OnInit {

  constructor(
    private actionPlanPriorityService: ActionPlanPriorityService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditActionPlanPriorityComponent>,

  ) { }


  actionPlanPriority: ActionPlanPriority;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR PRIORIDAD';

  ngOnInit(): void {

    this.initForm();


    this.initActionPlanPriority();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initActionPlanPriority() {
    this.actionPlanPriority = new ActionPlanPriority();
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

  obtain(id: string) {
    this.loading = true;
    this.actionPlanPriorityService.obtain(id)
      .subscribe((res: any) => {
        this.actionPlanPriority = res.data;
        this.setFormValue(this.actionPlanPriority); this.title = this.actionPlanPriority.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(actionPlanPriority: ActionPlanPriority) {
    this.form.setValue({
      name: ((actionPlanPriority.name == null) ? '' : actionPlanPriority.name),
      description: ((actionPlanPriority.description == null) ? '' : actionPlanPriority.description),
      abbreviation: ((actionPlanPriority.abbreviation == null) ? '' : actionPlanPriority.abbreviation),
      value: ((actionPlanPriority.value == null) ? '' : actionPlanPriority.value),
      color: ((actionPlanPriority.color == null) ? '' : actionPlanPriority.color),
    });
  }


  getFormValue() {
    this.actionPlanPriority.actionPlanPriorityId = Number(this.id);
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



    this.actionPlanPriorityService.update(this.actionPlanPriority)
      .subscribe(res => {
        this.actionPlanPriority = res.data;
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

