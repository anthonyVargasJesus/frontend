import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Owner } from 'app/models/owner';
import { ErrorManager } from 'app/errors/error-manager';
import { OwnerService } from 'app/services/owner.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styles: [
  ]
})


export class AddOwnerComponent implements OnInit {

  constructor(
    private ownerService: OwnerService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddOwnerComponent>,

  ) { }


  owner: Owner;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initOwner();

  }

  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initOwner() {
    this.owner = new Owner();
  }




  getFormValue() {
    this.owner.code = this.form.value.code;
    this.owner.name = this.form.value.name;
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



    this.ownerService.insert(this.owner)
      .subscribe(res => {
        this.owner = res.data;
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

