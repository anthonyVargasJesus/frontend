import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-documentation',
  templateUrl: './edit-documentation.component.html',
  styles: [
  ]
})
export class EditDocumentationComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditDocumentationComponent>,


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
      name: ['Análisis de contexto interno', [Validators.required, Validators.maxLength(100),]],
      description: ['Es un documento que define el alcance del SGSI considerando los procesos, funciones, activos, ubicaciones físicas, tecnología, partes interesadas y la determinación de los aspectos internos y externos a la organización.', [Validators.maxLength(500),]],
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
