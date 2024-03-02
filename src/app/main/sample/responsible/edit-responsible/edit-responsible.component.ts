import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-responsible',
  templateUrl: './edit-responsible.component.html',
  styles: [
  ]
})
export class EditResponsibleComponent implements OnInit {


  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditResponsibleComponent>,

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
      name: ['Oficial de Seguridad de la Información', [Validators.required]],
      description: ['Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, blanditiis quos ab ex enim hic possimus unde? Exercitationem ipsam explicabo, eveniet voluptatem quo molestiae corrupti, nulla culpa, adipisci itaque nam?', [Validators.maxLength(500),]],
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
