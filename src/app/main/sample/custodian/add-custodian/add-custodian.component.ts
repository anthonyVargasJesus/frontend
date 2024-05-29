import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Custodian } from 'app/models/custodian';
import { ErrorManager } from 'app/errors/error-manager';
import { CustodianService } from 'app/services/custodian.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-custodian',
  templateUrl: './add-custodian.component.html',
  styles: [
  ]
})


export class AddCustodianComponent implements OnInit {

  constructor(
    private custodianService: CustodianService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddCustodianComponent>,

  ) { }


  custodian: Custodian;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initCustodian();

  }

  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initCustodian() {
    this.custodian = new Custodian();
  }




  getFormValue() {
    this.custodian.code = this.form.value.code;
    this.custodian.name = this.form.value.name;
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



    this.custodianService.insert(this.custodian)
      .subscribe(res => {
        this.custodian = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } close() {
    this.dialogRef.close();
  }
}

