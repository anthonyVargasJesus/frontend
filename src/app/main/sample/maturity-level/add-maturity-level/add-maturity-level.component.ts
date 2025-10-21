import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { MaturityLevel } from 'app/models/maturity-level';
import { ErrorManager } from 'app/errors/error-manager';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-maturity-level',
  templateUrl: './add-maturity-level.component.html',
  styles: [
  ]
})

export class AddMaturityLevelComponent implements OnInit {

  constructor(
    private maturityLevelService: MaturityLevelService,
    public router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddMaturityLevelComponent>,

  ) { }


  maturityLevel: MaturityLevel;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();
    this.initMaturityLevel();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initMaturityLevel() {
    this.maturityLevel = new MaturityLevel();
  }


  setNullValues() {
  }


  getFormValue() {
    this.maturityLevel.name = this.form.value.name;
    this.maturityLevel.description = this.form.value.description;
    this.maturityLevel.abbreviation = this.form.value.abbreviation;
    this.maturityLevel.value = this.form.value.value;
    this.maturityLevel.color = this.form.value.color;
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

    this.maturityLevelService.insert(this.maturityLevel)
      .subscribe(res => {
        this.maturityLevel = res.data;
        this.setNullValues();
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
