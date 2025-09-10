import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ControlInDefaultRisk } from 'app/models/control-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlInDefaultRiskService } from 'app/services/control-in-default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefaultRiskService } from 'app/services/default-risk.service';
import { DefaultRisk } from 'app/models/default-risk';
import { DialogData } from 'app/models/dialog-data'; import { Control } from 'app/models/control';

@Component({
  selector: 'app-edit-control-in-default-risk-by-control',
  templateUrl: './edit-control-in-default-risk-by-control.component.html',
  styles: [
  ]
})
export class EditControlInDefaultRiskByControlComponent implements OnInit {

  constructor(
    private controlInDefaultRiskService: ControlInDefaultRiskService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private defaultRiskService: DefaultRiskService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditControlInDefaultRiskByControlComponent>,

  ) { }

  defaultRisks: DefaultRisk[] = [];
  controlInDefaultRisk: ControlInDefaultRisk;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR RIESGO';

  standardId: number;

  ngOnInit(): void {
    this.initForm();
    this.initControlInDefaultRisk();
    this.id = this.data['_id'];
    this.standardId = this.data['standardId'];
    this.getAllDefaultRisks();
  }


  initControlInDefaultRisk() {
    this.controlInDefaultRisk = new ControlInDefaultRisk();
    this.initDefaultRisk();
  }
  initDefaultRisk() {
    if (this.defaultRisks.length > 0)
      this.controlInDefaultRisk.defaultRisk = this.defaultRisks[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      defaultRiskId: ['', [Validators.required,]],
      isActive: [false, [Validators.maxLength(5),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.controlInDefaultRiskService.obtain(id)
      .subscribe((res: any) => {
        this.controlInDefaultRisk = res.data;
        this.setFormValue(this.controlInDefaultRisk); 
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(controlInDefaultRisk: ControlInDefaultRisk) {
    this.form.setValue({
      defaultRiskId: ((controlInDefaultRisk.defaultRiskId == null) ? '' : controlInDefaultRisk.defaultRiskId),
      isActive: ((controlInDefaultRisk.isActive == null) ? '' : controlInDefaultRisk.isActive),
    });
  }


  getFormValue() {
    this.controlInDefaultRisk.controlInDefaultRiskId = Number(this.id);
    this.controlInDefaultRisk.defaultRiskId = this.form.value.defaultRiskId;
    this.controlInDefaultRisk.isActive = this.form.value.isActive;
    if (this.form.value.isActive == "")
      this.controlInDefaultRisk.isActive = null;
  }

  getAllDefaultRisks() {
    this.loading = true;
    this.defaultRiskService.getAllBystandardId(this.standardId)
      .subscribe((res: any) => {
        this.defaultRisks = res.data;
        this.loading = false;
        this.obtain(this.id);
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
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

    this.controlInDefaultRiskService.update(this.controlInDefaultRisk)
      .subscribe(res => {
        this.controlInDefaultRisk = res.data;
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

