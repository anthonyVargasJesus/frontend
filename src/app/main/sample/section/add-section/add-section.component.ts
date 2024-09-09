import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';
import { Section } from 'app/models/section';
import { SectionService } from 'app/services/section.service';
import { Version } from 'app/models/version';
import { VersionService } from 'app/services/version.service';


@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styles: [
  ]
})
export class AddSectionComponent implements OnInit {

  constructor(
    private sectionService: SectionService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddSectionComponent>,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  sections: Section[] = [];

  section: Section;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  versionId: number;
  sectionId: string;
  documentationId: number;
  level: string;



  ngOnInit(): void {
    this.documentationId = this.data['documentationId'];
    this.versionId = this.data['versionId'];

    console.log('versionId', this.versionId);

    this.sectionId = this.data['sectionId'];
    this.level = this.data['level'];
    this.initForm();

    if (this.versionId)
      this.getAllSectionsByVersionId();
    else
      this.getAllSectionsByDocumentationId();

    this.initSection();
  }

  initForm() {
    this.form = this._formBuilder.group({
      numeration: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      level: [Number(this.level), [Validators.required, Validators.maxLength(8),]],
      parentId: [Number(this.sectionId), []],
    });
  }


  initSection() {
    this.section = new Section();
  }



  getAllSectionsByVersionId() {
    this.sectionService.getAll(this.versionId)
      .subscribe((res: any) => {
        this.sections = res.data;
        this.initSection();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getAllSectionsByDocumentationId() {
    this.sectionService.getAllByDocumentationId(this.documentationId)
      .subscribe((res: any) => {
        this.sections = res.data;
        console.log(res);
        this.initSection();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.section.numeration = this.form.value.numeration;
    this.section.name = this.form.value.name;
    this.section.description = this.form.value.description;
    this.section.level = this.form.value.level;
    this.section.parentId = this.form.value.parentId;
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

    this.section.versionId = this.versionId;
    this.section.documentationId = this.documentationId;

    this.sectionService.insert(this.section)
      .subscribe(res => {
        this.section = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } close() {
    this.dialogRef.close();
  }


}
