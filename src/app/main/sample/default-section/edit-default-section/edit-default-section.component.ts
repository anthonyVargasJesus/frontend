import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DefaultSection } from 'app/models/default-section';
import { ErrorManager } from 'app/errors/error-manager';
import { DefaultSectionService } from 'app/services/default-section.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-default-section',
  templateUrl: './edit-default-section.component.html',
  styles: [
  ]
})
export class EditDefaultSectionComponent implements OnInit {

  constructor(
    private defaultSectionService: DefaultSectionService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<EditDefaultSectionComponent>,

  ) { }

  defaultSections: DefaultSection[] = [];
  defaultSection: DefaultSection = new DefaultSection();
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initDefaultSection();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initDefaultSection() {
    this.defaultSection = new DefaultSection();
  }

  getAllDefaultSections(documentTypeId: number) {
    this.defaultSectionService.getAll(documentTypeId)
      .subscribe((res: any) => {
        this.defaultSections = res.data;
        this.initDefaultSection();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  initForm() {
    this.form = this._formBuilder.group({
      numeration: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      level: ['', [Validators.required, Validators.maxLength(8),]],
      parentId: [0, []],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.defaultSectionService.obtain(id)
      .subscribe((res: any) => {
        this.defaultSection = res.data;

        if (this.defaultSection)
          if (this.defaultSection.name)
            this.title = this.defaultSection.name.toUpperCase();
          
        this.getAllDefaultSections(this.defaultSection.documentTypeId);
        this.setFormValue(this.defaultSection);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(defaultSection: DefaultSection) {
    this.form.setValue({
      numeration: ((defaultSection.numeration == null) ? '' : defaultSection.numeration),
      name: ((defaultSection.name == null) ? '' : defaultSection.name),
      description: ((defaultSection.description == null) ? '' : defaultSection.description),
      level: ((defaultSection.level == null) ? '' : defaultSection.level),
      parentId: ((defaultSection.parentId == null) ? '' : defaultSection.parentId),
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


    this.defaultSectionService.update(this.defaultSection)
      .subscribe(res => {
        this.defaultSection = res.data;
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
