import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RiskStatus } from 'app/models/risk-status';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskStatusService } from 'app/services/risk-status.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-risk-status',
  templateUrl: './edit-risk-status.component.html',
  styles: [
  ]
})

export class EditRiskStatusComponent implements OnInit {

  constructor(
    private riskStatusService: RiskStatusService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRiskStatusComponent>,

  ) { }


  riskStatus: RiskStatus;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR RISKSTATUS';;

  ngOnInit(): void {

    this.initForm();


    this.initRiskStatus();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initRiskStatus() {
    this.riskStatus = new RiskStatus();
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
    this.riskStatusService.obtain(id)
      .subscribe((res: any) => {
        this.riskStatus = res.data;
        this.setFormValue(this.riskStatus); this.title = this.riskStatus.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(riskStatus: RiskStatus) {
    this.form.setValue({
      name: ((riskStatus.name == null) ? '' : riskStatus.name),
      description: ((riskStatus.description == null) ? '' : riskStatus.description),
      abbreviation: ((riskStatus.abbreviation == null) ? '' : riskStatus.abbreviation),
      value: ((riskStatus.value == null) ? '' : riskStatus.value),
      color: ((riskStatus.color == null) ? '' : riskStatus.color),
    });
  }


  getFormValue() {
    this.riskStatus.riskStatusId = Number(this.id);
    this.riskStatus.name = this.form.value.name;
    this.riskStatus.description = this.form.value.description;
    this.riskStatus.abbreviation = this.form.value.abbreviation;
    this.riskStatus.value = this.form.value.value;
    this.riskStatus.color = this.form.value.color;
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



    this.riskStatusService.update(this.riskStatus)
      .subscribe(res => {
        this.riskStatus = res.data;
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

