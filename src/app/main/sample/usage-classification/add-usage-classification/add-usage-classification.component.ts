import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { UsageClassification } from 'app/models/usage-classification';
import { ErrorManager } from 'app/errors/error-manager';
import { UsageClassificationService } from 'app/services/usage-classification.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-usage-classification',
  templateUrl: './add-usage-classification.component.html',
  styles: [
  ]
})


export class AddUsageClassificationComponent implements OnInit {

  constructor(
    private usageClassificationService: UsageClassificationService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddUsageClassificationComponent>,

  ) { }


  usageClassification: UsageClassification;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initUsageClassification();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initUsageClassification() {
    this.usageClassification = new UsageClassification();
  }




  getFormValue() {
    this.usageClassification.name = this.form.value.name;
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



    this.usageClassificationService.insert(this.usageClassification)
      .subscribe(res => {
        this.usageClassification = res.data;
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

