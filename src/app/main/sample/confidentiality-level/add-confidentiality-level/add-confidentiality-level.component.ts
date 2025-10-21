import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ConfidentialityLevel } from 'app/models/confidentiality-level';
import { ErrorManager } from 'app/errors/error-manager';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfidentialityLevelService } from 'app/services/confidentialityLevel.service';


@Component({
  selector: 'app-add-confidentiality-level',
  templateUrl: './add-confidentiality-level.component.html',
  styles: [
  ]
})
export class AddConfidentialityLevelComponent implements OnInit {

  constructor(
    private confidentialityLevelService: ConfidentialityLevelService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddConfidentialityLevelComponent>,

  ) { }


  confidentialityLevel: ConfidentialityLevel;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initConfidentialityLevel();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initConfidentialityLevel() {
    this.confidentialityLevel = new ConfidentialityLevel();
  }

  setNullValues() {
  }



  getFormValue() {
    this.confidentialityLevel.name = this.form.value.name;
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



    this.confidentialityLevelService.insert(this.confidentialityLevel)
      .subscribe(res => {
        this.confidentialityLevel = res.data;
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