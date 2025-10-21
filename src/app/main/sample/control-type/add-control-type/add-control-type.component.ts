import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ControlType } from 'app/models/control-type';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlTypeService } from 'app/services/control-type.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-control-type',
  templateUrl: './add-control-type.component.html',
  styles: [
  ]
})


export class AddControlTypeComponent implements OnInit {

  constructor(
    private controlTypeService: ControlTypeService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddControlTypeComponent>,

  ) { }


  controlType: ControlType;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initControlType();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      factor: ['', [Validators.maxLength(8),]],
      minimum: ['', [Validators.required, Validators.maxLength(8),]],
      maximum: ['', [Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initControlType() {
    this.controlType = new ControlType();
  }




  getFormValue() {
    this.controlType.name = this.form.value.name;
    this.controlType.description = this.form.value.description;
    this.controlType.abbreviation = this.form.value.abbreviation;
    this.controlType.factor = this.form.value.factor;
    this.controlType.minimum = this.form.value.minimum;
    this.controlType.maximum = this.form.value.maximum;
    this.controlType.color = this.form.value.color;

    if (this.form.value.minimum == "")
      this.controlType.minimum = null;
    if (this.form.value.maximum == "")
      this.controlType.maximum = null;
    if (this.form.value.factor == "")
      this.controlType.factor = null;
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

    this.controlTypeService.insert(this.controlType)
      .subscribe(res => {
        this.controlType = res.data;
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
