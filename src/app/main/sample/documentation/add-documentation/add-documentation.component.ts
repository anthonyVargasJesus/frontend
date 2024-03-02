import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-documentation',
  templateUrl: './add-documentation.component.html',
  styles: [
  ]
})
export class AddDocumentationComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddDocumentationComponent>,


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
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      template: ['', [Validators.maxLength(250),]],
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
