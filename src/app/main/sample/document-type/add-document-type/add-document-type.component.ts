import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { DocumentType } from 'app/models/document-type';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentTypeService } from 'app/services/document-type.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-document-type',
  templateUrl: './add-document-type.component.html',
  styles: [
  ]
})
export class AddDocumentTypeComponent implements OnInit {

  constructor(
    private documentTypeService: DocumentTypeService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddDocumentTypeComponent>,

  ) { }


  documentType: DocumentType;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initDocumentType();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initDocumentType() {
    this.documentType = new DocumentType();
  }

  setNullValues() {
  }


  getFormValue() {
    this.documentType.name = this.form.value.name;
    this.documentType.description = this.form.value.description;
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

    this.documentTypeService.insert(this.documentType)
      .subscribe(res => {
        this.documentType = res.data;
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

