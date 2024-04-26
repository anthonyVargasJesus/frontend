import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Personal } from 'app/models/personal';
import { ErrorManager } from 'app/errors/error-manager';
import { PersonalService } from 'app/services/personal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-personal',
  templateUrl: './edit-personal.component.html',
  styles: [
  ]
})
export class EditPersonalComponent implements OnInit {

  constructor(
    private personalService: PersonalService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditPersonalComponent>,

  ) { }


  personal: Personal;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initPersonal();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initPersonal() {
    this.personal = new Personal();
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

  obtain(id: string) {
    this.loading = true;
    this.personalService.obtain(id)
      .subscribe((res: any) => {
        this.personal = res.data;
        this.setNullValues()
        this.setFormValue(this.personal);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(personal: Personal) {
    this.form.setValue({
      name: ((personal.name == null) ? '' : personal.name),
      middleName: ((personal.middleName == null) ? '' : personal.middleName),
      firstName: ((personal.firstName == null) ? '' : personal.firstName),
      lastName: ((personal.lastName == null) ? '' : personal.lastName),
      email: ((personal.email == null) ? '' : personal.email),
      phone: ((personal.phone == null) ? '' : personal.phone),
      position: ((personal.position == null) ? '' : personal.position),
    });
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

    this.personalService.update(this.personal)
      .subscribe(res => {
        this.personal = res.data;
        this.setNullValues();
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
