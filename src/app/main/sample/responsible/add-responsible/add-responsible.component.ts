import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-responsible',
  templateUrl: './add-responsible.component.html',
  styles: [
  ]
})
export class AddResponsibleComponent implements OnInit {


  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddResponsibleComponent>,


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
      numeration: ['', [Validators.required, Validators.maxLength(10),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      requirement: ['1', []],
    });
  }


  get f() {
    return this.form.controls;
  }

  save() {
    

  }

  close() {
    this.dialogRef.close();
  }

  
}
