import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Responsible } from 'app/models/responsible';
import { ErrorManager } from 'app/errors/error-manager';
import { ResponsibleService } from 'app/services/responsible.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-responsible',
  templateUrl: './edit-responsible.component.html',
  styles: [
  ]
})
export class EditResponsibleComponent implements OnInit {

  constructor(
    private responsibleService: ResponsibleService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditResponsibleComponent>,

  ) { }


  responsible: Responsible;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initResponsible();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initResponsible() {
    this.responsible = new Responsible();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.responsibleService.obtain(id)
      .subscribe((res: any) => {
        this.responsible = res.data;
        this.setFormValue(this.responsible);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(responsible: Responsible) {
    this.form.setValue({
      name: ((responsible.name == null) ? '' : responsible.name),
      description: ((responsible.description == null) ? '' : responsible.description),
    });
  }


  getFormValue() {
    this.responsible.name = this.form.value.name;
    this.responsible.description = this.form.value.description;
  }
  setNullValues() {
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

    this.responsibleService.update(this.responsible)
      .subscribe(res => {
        this.responsible = res.data;
        this.setNullValues();
        this.dialogRef.close({ updated: true }); this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}

