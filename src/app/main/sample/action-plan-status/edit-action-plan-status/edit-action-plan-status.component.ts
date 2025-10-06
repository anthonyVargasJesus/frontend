import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionPlanStatus } from 'app/models/action-plan-status';
import { ErrorManager } from 'app/errors/error-manager';
import { ActionPlanStatusService } from 'app/services/action-plan-status.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-action-plan-status',
  templateUrl: './edit-action-plan-status.component.html',
  styles: [
  ]
})

export class EditActionPlanStatusComponent implements OnInit {

  constructor(
    private actionPlanStatusService: ActionPlanStatusService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditActionPlanStatusComponent>,

  ) { }


  actionPlanStatus: ActionPlanStatus;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR ACTIONPLANSTATUS';;

  ngOnInit(): void {

    this.initForm();


    this.initActionPlanStatus();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initActionPlanStatus() {
    this.actionPlanStatus = new ActionPlanStatus();
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
    this.actionPlanStatusService.obtain(id)
      .subscribe((res: any) => {
        this.actionPlanStatus = res.data;
        this.setFormValue(this.actionPlanStatus); this.title = this.actionPlanStatus.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(actionPlanStatus: ActionPlanStatus) {
    this.form.setValue({
      name: ((actionPlanStatus.name == null) ? '' : actionPlanStatus.name),
      description: ((actionPlanStatus.description == null) ? '' : actionPlanStatus.description),
      abbreviation: ((actionPlanStatus.abbreviation == null) ? '' : actionPlanStatus.abbreviation),
      value: ((actionPlanStatus.value == null) ? '' : actionPlanStatus.value),
      color: ((actionPlanStatus.color == null) ? '' : actionPlanStatus.color),
    });
  }


  getFormValue() {
    this.actionPlanStatus.actionPlanStatusId = Number(this.id);
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



    this.actionPlanStatusService.update(this.actionPlanStatus)
      .subscribe(res => {
        this.actionPlanStatus = res.data;
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

