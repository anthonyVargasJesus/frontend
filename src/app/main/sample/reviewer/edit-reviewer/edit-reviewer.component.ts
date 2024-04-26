import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Reviewer } from 'app/models/reviewer';
import { ErrorManager } from 'app/errors/error-manager';
import { ReviewerService } from 'app/services/reviewer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from 'app/services/personal.service';
import { Personal } from 'app/models/personal';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-reviewer',
  templateUrl: './edit-reviewer.component.html',
  styles: [
  ]
})
export class EditReviewerComponent implements OnInit {
  constructor(
    private reviewerService: ReviewerService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private personalService: PersonalService,
    private responsibleService: ResponsibleService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditReviewerComponent>,

  ) { }

  personals: Personal[] = [];
  responsibles: Responsible[] = [];
  reviewer: Reviewer;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';
  standardId: number;


  ngOnInit(): void {
    this.initForm();
     this.id = this.data['_id'];
     this.standardId = this.data['standardId'];
     this.getAllPersonals();
     this.getAllResponsibles();
     this.obtain(this.id);
  }


  initForm() {
    this.form = this._formBuilder.group({
      personal: [0, []],
      responsible: [0, []],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.reviewerService.obtain(id)
      .subscribe((res: any) => {
        this.reviewer = res.data;

        this.setFormValue(this.reviewer);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(reviewer: Reviewer) {
  
    this.form.setValue({
      personal: ((reviewer.personalId == 0) ? 0 : reviewer.personalId),
      responsible: ((reviewer.responsibleId == 0) ? 0 : reviewer.responsibleId),
    });

    console.log('reviewer', this.form.value);
  }

  getFormValue() {
    this.reviewer.personalId = this.form.value.personal;
    this.reviewer.responsibleId = this.form.value.responsible;
  }

  getAllPersonals() {
    this.personalService.getAll()
      .subscribe((res: any) => {
        this.personals = res.data;
      }, error => {
        ErrorManager.handleError(error);
      });
  }
  getAllResponsibles() {
    this.responsibleService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.responsibles = res.data;
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


    this.reviewerService.update(this.reviewer)
      .subscribe(res => {
        this.reviewer = res.data;
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
