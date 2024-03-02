import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-evaluation-admin',
  templateUrl: './edit-evaluation-admin.component.html',
  styles: [
  ]
})
export class EditEvaluationAdminComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditEvaluationAdminComponent>,


  ) { }


  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._formBuilder.group({
      startDate: [new Date(), []],
      endDate: [new Date(), []],
      description: ['PVN-SGSI-EVALUACION DE REQUISITOS Y CONTROLES-ISO-27001 VF', [Validators.maxLength(250),]],
      requirement: ['1', []],
    });

  }

  get f() {
    return this.form.controls;
  }

  save() {
    ;

  }

  close() {
    this.dialogRef.close();
  }

}
