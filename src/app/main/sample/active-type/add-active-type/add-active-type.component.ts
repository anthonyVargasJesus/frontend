import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ActiveType } from 'app/models/active-type';
import { ErrorManager } from 'app/errors/error-manager';
import { ActiveTypeService } from 'app/services/active-type.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-active-type',
  templateUrl: './add-active-type.component.html',
  styles: [
  ]
})


export class AddActiveTypeComponent implements OnInit {

  constructor(
    private activeTypeService: ActiveTypeService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddActiveTypeComponent>,

  ) { }


  activeType: ActiveType;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initActiveType();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initActiveType() {
    this.activeType = new ActiveType();
  }




  getFormValue() {
    this.activeType.name = this.form.value.name;
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



    this.activeTypeService.insert(this.activeType)
      .subscribe(res => {
        this.activeType = res.data;
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

