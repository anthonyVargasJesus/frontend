import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-evaluation-admin',
  templateUrl: './add-evaluation-admin.component.html',
  styles: [
  ]
})
export class AddEvaluationAdminComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddEvaluationAdminComponent>,


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
      startDate: ['', []],
      endDate: ['', []],
      description: ['', [Validators.maxLength(250),]],
      requirement: ['', []],
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
