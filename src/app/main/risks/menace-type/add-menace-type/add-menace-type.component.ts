import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { MenaceType } from 'app/models/menace-type';
import { ErrorManager } from 'app/errors/error-manager';
import { MenaceTypeService } from 'app/services/menace-type.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-menace-type',
  templateUrl: './add-menace-type.component.html',
  styles: [
  ]
})


export class AddMenaceTypeComponent implements OnInit {

  constructor(
    private menaceTypeService: MenaceTypeService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddMenaceTypeComponent>,

  ) { }


  menaceType: MenaceType;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initMenaceType();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initMenaceType() {
    this.menaceType = new MenaceType();
  }




  getFormValue() {
    this.menaceType.name = this.form.value.name;
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



    this.menaceTypeService.insert(this.menaceType)
      .subscribe(res => {
        this.menaceType = res.data;
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

