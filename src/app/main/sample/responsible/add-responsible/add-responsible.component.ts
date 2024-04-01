import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Responsible } from 'app/models/responsible';
import { ErrorManager } from 'app/errors/error-manager';
import { ResponsibleService } from 'app/services/responsible.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Standard } from 'app/models/standard';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-responsible',
  templateUrl: './add-responsible.component.html',
  styles: [
  ]
})
export class AddResponsibleComponent implements OnInit {


  constructor(
    private responsibleService: ResponsibleService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddResponsibleComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }


  responsible: Responsible;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: string;

  ngOnInit(): void {
    this.initForm();
    this.standardId = this.data['standardId'];

    this.initResponsible();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initResponsible() {
    this.responsible = new Responsible();
  }

  setNullValues() {
  }


  getFormValue() {
    this.responsible.name = this.form.value.name;
    this.responsible.description = this.form.value.description;
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

    this.responsible.standardId = Number(this.standardId);

    this.responsibleService.insert(this.responsible)
      .subscribe(res => {
        this.responsible = res.data;
        this.setNullValues();
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

