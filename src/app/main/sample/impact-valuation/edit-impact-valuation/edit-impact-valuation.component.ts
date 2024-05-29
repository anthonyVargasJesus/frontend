import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ImpactValuation } from 'app/models/impact-valuation';
import { ErrorManager } from 'app/errors/error-manager';
import { ImpactValuationService } from 'app/services/impact-valuation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-impact-valuation',
  templateUrl: './edit-impact-valuation.component.html',
  styles: [
  ]
})
export class EditImpactValuationComponent implements OnInit {

  constructor(
    private impactValuationService: ImpactValuationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditImpactValuationComponent>,

  ) { }


  impactValuation: ImpactValuation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initImpactValuation();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initImpactValuation() {
    this.impactValuation = new ImpactValuation();
  }





  initForm() {
    this.form = this._formBuilder.group({
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      minimumValue: ['', [Validators.maxLength(8),]],
      maximumValue: ['', [Validators.maxLength(8),]],
      defaultValue: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.impactValuationService.obtain(id)
      .subscribe((res: any) => {
        this.impactValuation = res.data;
        this.setFormValue(this.impactValuation);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(impactValuation: ImpactValuation) {
    this.form.setValue({
      abbreviation: ((impactValuation.abbreviation == null) ? '' : impactValuation.abbreviation),
      name: ((impactValuation.name == null) ? '' : impactValuation.name),
      minimumValue: ((impactValuation.minimumValue == null) ? '' : impactValuation.minimumValue),
      maximumValue: ((impactValuation.maximumValue == null) ? '' : impactValuation.maximumValue),
      defaultValue: ((impactValuation.defaultValue == null) ? '' : impactValuation.defaultValue),
    });
  }


  getFormValue() {
    this.impactValuation.impactValuationId = Number(this.id);
    this.impactValuation.abbreviation = this.form.value.abbreviation;
    this.impactValuation.name = this.form.value.name;
    this.impactValuation.minimumValue = this.form.value.minimumValue;
    this.impactValuation.maximumValue = this.form.value.maximumValue;
    
    this.impactValuation.defaultValue = this.form.value.defaultValue;

    if (this.form.value.minimumValue == "")
      this.impactValuation.minimumValue = null;
    if (this.form.value.maximumValue == "")
      this.impactValuation.maximumValue = null;

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

    console.log(this.impactValuation);

    this.impactValuationService.update(this.impactValuation)
      .subscribe(res => {
        this.impactValuation = res.data;
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
