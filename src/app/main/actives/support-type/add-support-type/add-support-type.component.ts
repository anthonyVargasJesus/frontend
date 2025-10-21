import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { SupportType } from 'app/models/support-type';
import { ErrorManager } from 'app/errors/error-manager';
import { SupportTypeService } from 'app/services/support-type.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-support-type',
  templateUrl: './add-support-type.component.html',
  styles: [
  ]
})


export class AddSupportTypeComponent implements OnInit {

  constructor(
    private supportTypeService: SupportTypeService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddSupportTypeComponent>,

  ) { }


  supportType: SupportType;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initSupportType();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initSupportType() {
    this.supportType = new SupportType();
  }




  getFormValue() {
    this.supportType.name = this.form.value.name;
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



    this.supportTypeService.insert(this.supportType)
      .subscribe(res => {
        this.supportType = res.data;
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
