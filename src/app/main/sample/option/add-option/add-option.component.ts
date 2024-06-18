import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Option } from 'app/models/option';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionService } from 'app/services/option.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-option',
  templateUrl: './add-option.component.html',
  styles: [
  ]
})


export class AddOptionComponent implements OnInit {

  constructor(
    private optionService: OptionService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddOptionComponent>,

  ) { }


  option: Option;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initOption();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      image: ['', [Validators.maxLength(200),]],
      url: ['', [Validators.required, Validators.maxLength(200),]],
      isMobile: [false, [Validators.maxLength(5),]],
    });
  }

  initOption() {
    this.option = new Option();
  }




  getFormValue() {
    this.option.name = this.form.value.name;
    this.option.image = this.form.value.image;
    this.option.url = this.form.value.url;
    this.option.isMobile = this.form.value.isMobile;
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



    this.optionService.insert(this.option)
      .subscribe(res => {
        this.option = res.data;
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

