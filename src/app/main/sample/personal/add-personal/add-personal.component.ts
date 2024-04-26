import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Personal } from 'app/models/personal';
import { ErrorManager } from 'app/errors/error-manager';
import { PersonalService } from 'app/services/personal.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-personal',
  templateUrl: './add-personal.component.html',
  styles: [
  ]
})
export class AddPersonalComponent implements OnInit {

  constructor(
    private personalService: PersonalService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddPersonalComponent>,

  ) { }


  personal: Personal;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initPersonal();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      middleName: ['', [Validators.maxLength(100),]],
      firstName: ['', [Validators.required, Validators.maxLength(100),]],
      lastName: ['', [Validators.maxLength(100),]],
      email: ['', [Validators.maxLength(200),]],
      phone: ['', [Validators.maxLength(100),]],
      position: ['', [Validators.maxLength(200),]],
    });
  }

  initPersonal() {
    this.personal = new Personal();
  }


  setNullValues() {
  }


  getFormValue() {
    this.personal.name = this.form.value.name;
    this.personal.middleName = this.form.value.middleName;
    this.personal.firstName = this.form.value.firstName;
    this.personal.lastName = this.form.value.lastName;
    this.personal.email = this.form.value.email;
    this.personal.phone = this.form.value.phone;
    this.personal.position = this.form.value.position;
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

  this.personal.image = "";

    this.personalService.insert(this.personal)
      .subscribe(res => {
        this.personal = res.data;
        this.setNullValues();
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } 
  
  close() {
    this.dialogRef.close();
  }


}
