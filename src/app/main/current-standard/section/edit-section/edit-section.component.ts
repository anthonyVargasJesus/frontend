import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ErrorManager } from 'app/errors/error-manager';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';
import { SectionService } from 'app/services/section.service';
import { Section } from 'app/models/section';


@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styles: [
  ]
})
export class EditSectionComponent implements OnInit {

  constructor(
    private sectionService: SectionService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<EditSectionComponent>,

  ) { }

  sections: Section[] = [];
  section: Section = new Section();
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initSection();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initSection() {
    this.section = new Section();
  }

  getAllSections(documentTypeId: number) {
    this.sectionService.getAll(documentTypeId)
      .subscribe((res: any) => {
        this.sections = res.data;
        this.initSection();
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
    this.sectionService.obtain(id)
      .subscribe((res: any) => {
        this.section = res.data;

        if (this.section)
          if (this.section.name)
            this.title = this.section.name.toUpperCase();
          
        this.getAllSections(this.section.versionId);
        this.setFormValue(this.section);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(section: Section) {
    this.form.setValue({
      numeration: ((section.numeration == null) ? '' : section.numeration),
      name: ((section.name == null) ? '' : section.name),
      description: ((section.description == null) ? '' : section.description),
      level: ((section.level == null) ? '' : section.level),
      parentId: ((section.parentId == null) ? '' : section.parentId),
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

    this.section.sectionId = Number(this.id);

    this.sectionService.update(this.section)
      .subscribe(res => {
        this.section = res.data;
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
