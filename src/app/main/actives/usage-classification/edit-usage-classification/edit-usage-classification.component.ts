import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsageClassification } from 'app/models/usage-classification';
import { ErrorManager } from 'app/errors/error-manager';
import { UsageClassificationService } from 'app/services/usage-classification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-usage-classification',
  templateUrl: './edit-usage-classification.component.html',
  styles: [
  ]
})
export class EditUsageClassificationComponent implements OnInit {

  constructor(
    private usageClassificationService: UsageClassificationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditUsageClassificationComponent>,

  ) { }


  usageClassification: UsageClassification;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initUsageClassification();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initUsageClassification() {
    this.usageClassification = new UsageClassification();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.usageClassificationService.obtain(id)
      .subscribe((res: any) => {
        this.usageClassification = res.data;
        this.setFormValue(this.usageClassification);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(usageClassification: UsageClassification) {
    this.form.setValue({
      name: ((usageClassification.name == null) ? '' : usageClassification.name),
    });
  }


  getFormValue() {
    this.usageClassification.usageClassificationId = Number(this.id);
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



    this.usageClassificationService.update(this.usageClassification)
      .subscribe(res => {
        this.usageClassification = res.data;
        this.dialogRef.close({ updated: true });
        this.loading2 = false;


      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}

