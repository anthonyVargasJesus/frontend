import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styles: [
  ]
})
export class EditRequirementComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditRequirementComponent>,


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
      numeration: ['4', [Validators.required, Validators.maxLength(10),]],
      name: ['Contexto de la organización', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
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
