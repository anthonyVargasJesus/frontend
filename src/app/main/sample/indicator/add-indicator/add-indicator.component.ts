import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { Indicator } from 'app/models/indicator';
import { IndicatorService } from 'app/services/indicator.service';

@Component({
  selector: 'app-add-indicator',
  templateUrl: './add-indicator.component.html',
  styles: [
  ]
})
export class AddIndicatorComponent implements OnInit {


  constructor(
    private indicatorService: IndicatorService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddIndicatorComponent>,

  ) { }


  indicator: Indicator;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();
    this.initIndicator();

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

  initIndicator() {
    this.indicator = new Indicator();
  }

  setNullValues() {
  }

  getFormValue() {
    this.indicator.name = this.form.value.name;
    this.indicator.description = this.form.value.description;
    this.indicator.abbreviation = this.form.value.abbreviation;
    this.indicator.value = this.form.value.value;
    this.indicator.color = this.form.value.color;
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

    this.indicatorService.insert(this.indicator)
      .subscribe(res => {
        this.indicator = res.indicator;
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
