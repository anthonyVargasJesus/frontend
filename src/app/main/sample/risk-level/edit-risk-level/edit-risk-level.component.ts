import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RiskLevel } from 'app/models/risk-level';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskLevelService } from 'app/services/risk-level.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-risk-level',
  templateUrl: './edit-risk-level.component.html',
  styles: [
  ]
})
export class EditRiskLevelComponent implements OnInit {

  constructor(
    private riskLevelService: RiskLevelService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRiskLevelComponent>,

  ) { }


  riskLevel: RiskLevel;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initRiskLevel();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initRiskLevel() {
    this.riskLevel = new RiskLevel();
  }







  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      factor: ['', [Validators.maxLength(8),]],
      minimum: ['', [Validators.required, Validators.maxLength(8),]],
      maximum: ['', [Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.riskLevelService.obtain(id)
      .subscribe((res: any) => {
        this.riskLevel = res.data;
        this.setFormValue(this.riskLevel);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(riskLevel: RiskLevel) {
    this.form.setValue({
      name: ((riskLevel.name == null) ? '' : riskLevel.name),
      description: ((riskLevel.description == null) ? '' : riskLevel.description),
      abbreviation: ((riskLevel.abbreviation == null) ? '' : riskLevel.abbreviation),
      factor: ((riskLevel.factor == null) ? '' : riskLevel.factor),
      minimum: ((riskLevel.minimum == null) ? '' : riskLevel.minimum),
      maximum: ((riskLevel.maximum == null) ? '' : riskLevel.maximum),
      color: ((riskLevel.color == null) ? '' : riskLevel.color),
    });
  }


  getFormValue() {
    this.riskLevel.riskLevelId = Number(this.id);
    this.riskLevel.name = this.form.value.name;
    this.riskLevel.description = this.form.value.description;
    this.riskLevel.abbreviation = this.form.value.abbreviation;
    this.riskLevel.factor = this.form.value.factor;
    this.riskLevel.minimum = this.form.value.minimum;
    this.riskLevel.maximum = this.form.value.maximum;
    this.riskLevel.color = this.form.value.color;

    if (this.form.value.minimum == "")
      this.riskLevel.minimum = null;
    if (this.form.value.maximum == "")
      this.riskLevel.maximum = null;
    if (this.form.value.factor == "")
      this.riskLevel.factor = null;
    
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



    this.riskLevelService.update(this.riskLevel)
      .subscribe(res => {
        this.riskLevel = res.data;
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

