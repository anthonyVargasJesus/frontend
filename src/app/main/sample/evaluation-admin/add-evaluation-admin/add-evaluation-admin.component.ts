import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Evaluation } from 'app/models/evaluation';
import { ErrorManager } from 'app/errors/error-manager';
import { EvaluationService } from 'app/services/evaluation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { StandardService } from 'app/services/standard.service';
import { Standard } from 'app/models/standard';


@Component({
  selector: 'app-add-evaluation-admin',
  templateUrl: './add-evaluation-admin.component.html',
  styles: [
  ]
})


export class AddEvaluationAdminComponent implements OnInit {

  constructor(
    private evaluationService: EvaluationService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddEvaluationAdminComponent>,
    private standardService: StandardService
  ) { }

  standards: Standard[] = [];
  evaluations: Evaluation[] = [];

  evaluation: Evaluation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  minDate: Date;

  ngOnInit(): void {
    this.initForm();
    this.getAllStandards();
    this.getAllEvaluations();

    this.initEvaluation();

  }

  initForm() {
    this.form = this._formBuilder.group({
      startDate: ['', [Validators.required,]],
      endDate: ['', []],
      description: ['', [Validators.required, Validators.maxLength(250),]],
      evaluation: ['', []],
      isGapAnalysis: [false, [Validators.maxLength(5),]],
      isCurrent:[false, [Validators.required, Validators.maxLength(5), ]],
    });
  }

  initEvaluation() {
    this.evaluation = new Evaluation();
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


  getAllEvaluations() {
    this.evaluationService.getAll()
      .subscribe((res: any) => {
        this.evaluations = res.data;
        this.initEvaluation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.evaluation.startDate = this.form.value.startDate;
    this.evaluation.endDate = this.form.value.endDate;
    this.evaluation.description = this.form.value.description;
    this.evaluation.standardId = this.form.value.standard;
    this.evaluation.referenceEvaluationId =(this.form.value.evaluation == '')?null:this.form.value.evaluation ;
    this.evaluation.isGapAnalysis =(this.form.value.isGapAnalysis == '')?null:this.form.value.isGapAnalysis ;
    this.evaluation.isCurrent = this.form.value.isCurrent;
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

    // if (this.evaluation.evaluation._id == '')
    //   this.evaluation.evaluation = null;

    this.evaluationService.insert(this.evaluation)
      .subscribe(res => {
        this.evaluation = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  initDateChanged(event: any, ) {
    this.minDate = event.value;
  }

  close() {
    this.dialogRef.close();
  }

}

