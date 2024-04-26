import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Reviewer } from 'app/models/reviewer';
import { ErrorManager } from 'app/errors/error-manager';
import { ReviewerService } from 'app/services/reviewer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from 'app/services/personal.service';
import { Personal } from 'app/models/personal';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { VersionService } from 'app/services/version.service';
import { Version } from 'app/models/version';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-reviewer',
  templateUrl: './add-reviewer.component.html',
  styles: [
  ]
})
export class AddReviewerComponent implements OnInit {

  constructor(
    private reviewerService: ReviewerService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddReviewerComponent>, private personalService: PersonalService,
    private responsibleService: ResponsibleService,
    private versionService: VersionService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  personals: Personal[] = [];
  responsibles: Responsible[] = [];
  versions: Version[] = [];

  reviewer: Reviewer;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  versionId: string;
  standardId: number;
  documentationId: number;

  ngOnInit(): void {
    this.initForm();
    this.versionId = this.data['versionId'];
    this.standardId = this.data['standardId'];
    this.documentationId = this.data['documentationId'];
    this.getAllPersonals();
    this.getAllResponsibles();
    this.initReviewer();
  }

  initForm() {
    this.form = this._formBuilder.group({
      personal: [0, []],
      responsible: [0, []],
    });
  }

  initReviewer() {
    this.reviewer = new Reviewer();
  }

  getAllPersonals() {
    this.personalService.getAll()
      .subscribe((res: any) => {
        this.personals = res.data;
        this.initReviewer();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getAllResponsibles() {
    this.responsibleService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.initReviewer();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.reviewer.personalId = this.form.value.personal;
    this.reviewer.responsibleId = this.form.value.responsible;
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

    this.reviewer.versionId = Number(this.versionId); 
    this.reviewer.documentationId = Number(this.documentationId); 


    this.reviewerService.insert(this.reviewer)
      .subscribe(res => {
        this.reviewer = res.data;
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
