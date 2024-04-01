import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Evaluation } from 'app/models/evaluation';
import { ErrorManager } from 'app/errors/error-manager';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';
import { EvaluationService } from 'app/services/evaluation.service';
import { Standard } from 'app/models/standard';
import { StandardService } from 'app/services/standard.service';


@Component({
  selector: 'app-edit-evaluation-admin',
  templateUrl: './edit-evaluation-admin.component.html',
  styles: [
  ]
})
export class EditEvaluationAdminComponent implements OnInit {

  constructor(
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private standardService: StandardService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, 
    private dialogRef: MatDialogRef<EditEvaluationAdminComponent>,

  ) { }

  standards: Standard[] = [];

  evaluation: Evaluation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.getAllStandards();
    this.initEvaluation();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }

  initEvaluation() {
    this.evaluation = new Evaluation();
  }

  initForm() {
    this.form = this._formBuilder.group({
      startDate: ['', [Validators.required,]],
      endDate: ['', []],
      description: ['', [Validators.maxLength(250),]],
      standard: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.evaluationService.obtain(id)
      .subscribe((res: any) => {
        this.evaluation = res.data;
        this.setFormValue(this.evaluation);
        console.log(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(evaluation: Evaluation) {
    this.form.setValue({
      startDate: ((evaluation.startDate == null) ? '' : evaluation.startDate),
      endDate: ((evaluation.endDate == null) ? '' : evaluation.endDate),
      description: ((evaluation.description == null) ? '' : evaluation.description),
      standard: ((evaluation.standardId == null) ? '' : evaluation.standardId),
    });
  }


  getFormValue() {
    this.evaluation.startDate = this.form.value.startDate;
    this.evaluation.endDate = this.form.value.endDate;
    this.evaluation.description = this.form.value.description;
    this.evaluation.standardId = this.form.value.standard;
  }

  getAllStandards() {
    this.standardService.getAll()
      .subscribe((res: any) => {
        this.standards = res.data;
        this.initEvaluation();
      }, error => {
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

    this.evaluationService.update(this.evaluation)
      .subscribe(res => {
        this.evaluation = res.data;
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

