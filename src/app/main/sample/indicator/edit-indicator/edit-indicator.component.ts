import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { Indicator } from 'app/models/indicator';
import { IndicatorService } from 'app/services/indicator.service';

@Component({
  selector: 'app-edit-indicator',
  templateUrl: './edit-indicator.component.html',
  styles: [
  ]
})
export class EditIndicatorComponent implements OnInit {

  constructor(
    private indicatorService: IndicatorService,
    private _formBuilder: FormBuilder,
     @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditIndicatorComponent>,

  ) { }


  indicator: Indicator;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initIndicator();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initIndicator() {
    this.indicator = new Indicator();
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

  obtain(id: string) {
    this.loading = true;
    this.indicatorService.obtain(id)
      .subscribe((res: any) => {
        console.log(res);
        this.indicator = res.data;
        this.setFormValue(this.indicator);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(indicator: Indicator) {
    this.form.setValue({
      name: ((indicator.name == null) ? '' : indicator.name),
      description: ((indicator.description == null) ? '' : indicator.description),
      abbreviation: ((indicator.abbreviation == null) ? '' : indicator.abbreviation),
      value: ((indicator.value == null) ? '' : indicator.value),
      color: ((indicator.color == null) ? '' : indicator.color),
    });
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

    this.indicatorService.update(this.indicator)
      .subscribe(res => {
        this.indicator = res.data;
        this.dialogRef.close({ updated: true }); this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}
