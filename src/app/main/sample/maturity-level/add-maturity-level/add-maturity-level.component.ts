import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { MaturityLevel } from 'app/models/maturity-level';
import { ErrorManager } from 'app/errors/error-manager';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BreachSeverityService } from 'app/services/breach-severity.service';
import { BreachSeverity } from 'app/models/breach-severity';


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
    private breachSeverityService: BreachSeverityService,

  ) { }


  maturityLevel: MaturityLevel;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  breachSeverities: BreachSeverity[] = [];


  ngOnInit(): void {
    this.initForm();
    this.initMaturityLevel();
    this.getAllBreachSeverities();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
      generatesBreach: [false, []],
      breachSeverityId: ['', []],
    });

    this.form.get('generatesBreach')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('breachSeverityId')?.setValidators([Validators.required]);
      } else {
        this.form.get('breachSeverityId')?.clearValidators();
        this.form.patchValue({ breachSeverityId: '' });
      }
      this.form.get('breachSeverityId')?.updateValueAndValidity();
    });
  }

  initMaturityLevel() {
    this.maturityLevel = new MaturityLevel();
  }

  getAllBreachSeverities() {
    this.loading = true;
    this.breachSeverityService.getAll()
      .subscribe((res: any) => {
        this.breachSeverities = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  setNullValues() {
  }


  getFormValue() {
    this.maturityLevel.name = this.form.value.name;
    this.maturityLevel.description = this.form.value.description;
    this.maturityLevel.abbreviation = this.form.value.abbreviation;
    this.maturityLevel.value = this.form.value.value;
    this.maturityLevel.color = this.form.value.color;
    this.maturityLevel.generatesBreach = this.form.value.generatesBreach;
    this.maturityLevel.breachSeverityId = this.form.value.breachSeverityId ? Number(this.form.value.breachSeverityId) : null;
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
