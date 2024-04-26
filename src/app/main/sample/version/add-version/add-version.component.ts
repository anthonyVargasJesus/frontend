import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Version } from 'app/models/version';
import { ErrorManager } from 'app/errors/error-manager';
import { VersionService } from 'app/services/version.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfidentialityLevel } from 'app/models/confidentiality-level';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { ConfidentialityLevelService } from 'app/services/confidentialityLevel.service';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-version',
  templateUrl: './add-version.component.html',
  styles: [
  ]
})
export class AddVersionComponent implements OnInit {

  constructor(
    private versionService: VersionService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddVersionComponent>,
    private confidentialityLevelService: ConfidentialityLevelService,
    private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  confidentialityLevels: ConfidentialityLevel[] = [];
  documentations: Documentation[] = [];

  version: Version;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  documentationId: number;
  standardId: number;

  ngOnInit(): void {
    this.documentationId = this.data['documentationId'];
    this.standardId = this.data['standardId'];
    this.initForm();
    this.getAllConfidentialityLevels();
    //this.getAllDocumentations();
    this.initVersion();

  }

  initForm() {
    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(8),]],
      code: ['', [Validators.required, Validators.maxLength(100),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
      confidentialityLevel: [0, [Validators.required,]],
      date: ['', [Validators.required,]],
      isCurrent: [false],
      //fileName: ['', [Validators.maxLength(500),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initVersion() {
    this.version = new Version();
    this.initConfidentialityLevel();
    this.initDocumentation();
  }



  initConfidentialityLevel() {

  }

  initDocumentation() {

  }


  setNullValues() {

    if (!this.version.confidentialityLevel)
      this.initConfidentialityLevel();
    if (!this.version.documentation)
      this.initDocumentation();
  }


  getAllConfidentialityLevels() {
    this.confidentialityLevelService.getAll()
      .subscribe((res: any) => {
        this.confidentialityLevels = res.data;
        this.initVersion();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.version.number = this.form.value.number;
    this.version.code = this.form.value.code;
    this.version.name = this.form.value.name;
     if (this.form.value.confidentialityLevel)
    this.version.confidentialityLevelId = this.form.value.confidentialityLevel;
    this.version.date = this.form.value.date;
    this.version.isCurrent = this.form.value.isCurrent;
    //this.version.fileName = this.form.value.fileName;
    this.version.description = this.form.value.description;
  }






  get f() {
    return this.form.controls;
  }

  save() {

    console.log(this.form);

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.version.documentationId = this.documentationId;
    this.version.standardId = this.standardId;
    this.version.fileName = '';

    this.versionService.insert(this.version)
      .subscribe(res => {
        this.version = res.data;
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