import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { DefaultSectionService } from 'app/services/default-section.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DefaultSection } from 'app/models/default-section';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-default-section',
  templateUrl: './add-default-section.component.html',
  styles: [
  ]
})
export class AddDefaultSectionComponent implements OnInit {

  constructor(
    private defaultSectionService: DefaultSectionService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddDefaultSectionComponent>,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  defaultSections: DefaultSection[] = [];

  defaultSection: DefaultSection;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  documentTypeId: number;
  defaultSectionId: string;
  level: string;

  ngOnInit(): void {
    this.documentTypeId = this.data['documentTypeId'];
    this.defaultSectionId = this.data['defaultSectionId'];
    this.level = this.data['level'];
    this.initForm();
    this.getAllDefaultSections();
    this.initDefaultSection();
  }

  initForm() {
    this.form = this._formBuilder.group({
      numeration: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      level: [Number(this.level), [Validators.required, Validators.maxLength(8),]],
      parentId: [Number(this.defaultSectionId), []],
    });
  }


  initDefaultSection() {
    this.defaultSection = new DefaultSection();
  }


  getAllDefaultSections() {
    this.defaultSectionService.getAll(this.documentTypeId)
      .subscribe((res: any) => {
        this.defaultSections = res.data;
        this.initDefaultSection();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.defaultSection.numeration = this.form.value.numeration;
    this.defaultSection.name = this.form.value.name;
    this.defaultSection.description = this.form.value.description;
    this.defaultSection.level = this.form.value.level;
    this.defaultSection.parentId = this.form.value.parentId;
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

    this.defaultSection.documentTypeId = this.documentTypeId;

    this.defaultSectionService.insert(this.defaultSection)
      .subscribe(res => {
        this.defaultSection = res.data;
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
