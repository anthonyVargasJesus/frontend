import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RiskTreatment } from 'app/models/risk-treatment';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskTreatmentService } from 'app/services/risk-treatment.service';
import { RiskTreatmentMethodService } from 'app/services/risk-treatment-method.service';
import { RiskTreatmentMethod } from 'app/models/risk-treatment-method';
import { RiskLevelService } from 'app/services/risk-level.service';
import { RiskLevel } from 'app/models/risk-level';
import { ResidualRiskService } from 'app/services/residual-risk.service';
import { ResidualRisk } from 'app/models/residual-risk';
import { RiskService } from 'app/services/risk.service';
import { Risk } from 'app/models/risk';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-risk-treatment-by-risk',
  templateUrl: './edit-risk-treatment-by-risk.component.html',
  styles: [
  ]
})

export class EditRiskTreatmentByRiskComponent implements OnInit {

  riskTreatmentId: number;
  valuationCID: number;

  constructor(
    private riskTreatmentService: RiskTreatmentService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private riskTreatmentMethodService: RiskTreatmentMethodService,
    private riskLevelService: RiskLevelService,
    private residualRiskService: ResidualRiskService,
    private riskService: RiskService,
    private dialogRef: MatDialogRef<EditRiskTreatmentByRiskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  riskTreatmentMethods: RiskTreatmentMethod[] = [];
  riskLevels: RiskLevel[] = [];
  residualRisks: ResidualRisk[] = [];
  riskTreatment: RiskTreatment;
  loading = false;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR TRATAMIENTO';
  color: string = '';
  selectedRisk: Risk = new Risk();
  riskId: string;


  ngOnInit(): void {
    this.riskTreatmentId = this.data['riskTreatmentId'];
    this.riskId = this.data['riskId'];
    this.initForm();
    this.initRiskTreatment();
    this.obtainRisk();
  }

  obtainRisk() {
    this.loading = true;
    this.riskService.obtain(this.riskId.toString())
      .subscribe((res: any) => {
        this.selectedRisk = res.data;
        this.valuationCID = this.selectedRisk.valuationCID;
        this.initForm();
        this.getAllRiskTreatmentMethods();

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  initRiskTreatment() {
    this.riskTreatment = new RiskTreatment();
  }

  initForm() {
    this.form = this._formBuilder.group({
      riskTreatmentMethodId: ['', [Validators.required,]],
      controlType: ['', [Validators.required, Validators.maxLength(500),]],
      controlsToImplement: ['', [Validators.maxLength(500),]],
      menaceLevelValue: ['', [Validators.maxLength(8),]],
      vulnerabilityLevelValue: ['', [Validators.maxLength(8),]],
      riskAssessmentValue: ['', [Validators.maxLength(8),]],
      riskLevelId: ['', []],
      residualRisklId: ['', []],
    });
  }

  obtain(id: number) {
    this.loading = true;
    this.riskTreatmentService.obtain(id.toString())
      .subscribe((res: any) => {
        this.riskTreatment = res.data;
        this.setFormValue(this.riskTreatment);
        this.setRiskLevelColor(this.riskTreatment.riskLevelId);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(riskTreatment: RiskTreatment) {
    this.form.setValue({
      riskTreatmentMethodId: ((riskTreatment.riskTreatmentMethodId == null) ? '' : riskTreatment.riskTreatmentMethodId),
      controlType: ((riskTreatment.controlType == null) ? '' : riskTreatment.controlType),
      controlsToImplement: ((riskTreatment.controlsToImplement == null) ? '' : riskTreatment.controlsToImplement),
      menaceLevelValue: ((riskTreatment.menaceLevelValue == null) ? '' : riskTreatment.menaceLevelValue),
      vulnerabilityLevelValue: ((riskTreatment.vulnerabilityLevelValue == null) ? '' : riskTreatment.vulnerabilityLevelValue),
      riskAssessmentValue: ((riskTreatment.riskAssessmentValue == null) ? '' : riskTreatment.riskAssessmentValue),
      riskLevelId: ((riskTreatment.riskLevelId == null) ? '' : riskTreatment.riskLevelId),
      residualRisklId: ((riskTreatment.residualRiskId == null) ? '' : riskTreatment.residualRiskId),
    });
  }


  getFormValue() {
    this.riskTreatment.riskTreatmentId = Number(this.riskTreatmentId);
    this.riskTreatment.riskTreatmentMethodId = this.form.value.riskTreatmentMethodId;
    this.riskTreatment.controlType = this.form.value.controlType;
    this.riskTreatment.controlsToImplement = this.form.value.controlsToImplement;
    if (this.form.value.controlsToImplement == "")
      this.riskTreatment.controlsToImplement = null;
    this.riskTreatment.menaceLevelValue = this.form.value.menaceLevelValue;
    if (this.form.value.menaceLevelValue == "")
      this.riskTreatment.menaceLevelValue = null;
    this.riskTreatment.vulnerabilityLevelValue = this.form.value.vulnerabilityLevelValue;
    if (this.form.value.vulnerabilityLevelValue == "")
      this.riskTreatment.vulnerabilityLevelValue = null;
    this.riskTreatment.riskAssessmentValue = this.form.value.riskAssessmentValue;
    if (this.form.value.riskAssessmentValue == "")
      this.riskTreatment.riskAssessmentValue = null;
    this.riskTreatment.riskLevelId = this.form.value.riskLevelId;
    if (this.form.value.riskLevelId == "")
      this.riskTreatment.riskLevelId = null;
    this.riskTreatment.residualRiskId = this.form.value.residualRisklId;
    if (this.form.value.residualRisklId == "")
      this.riskTreatment.residualRiskId = null;
  }

  getAllRiskTreatmentMethods() {
    this.riskTreatmentMethodService.getAll()
      .subscribe((res: any) => {
        this.riskTreatmentMethods = res.data;
        this.getAllRiskLevels();

      }, error => {
        ErrorManager.handleError(error);
      });
  }
  getAllRiskLevels() {
    this.riskLevelService.getAll()
      .subscribe((res: any) => {
        this.riskLevels = res.data;
        this.getAllResidualRisks();
      }, error => {
        ErrorManager.handleError(error);
      });
  }
  getAllResidualRisks() {
    this.residualRiskService.getAll()
      .subscribe((res: any) => {
        this.residualRisks = res.data;
        this.obtain(this.riskTreatmentId);
      }, error => {
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

    this.riskTreatmentService.update(this.riskTreatment)
      .subscribe(res => {
        this.riskTreatment = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  onInputBlurWithEventMenaceLevelValue(event: any) {
    const menaceLevelValue = event.target.value;
    this.riskTreatment.menaceLevelValue = this.form.value.menaceLevelValue;
    this.riskTreatment.vulnerabilityLevelValue = this.form.value.vulnerabilityLevelValue;
    this.calculateRiskAssessmentValue(menaceLevelValue, this.form.value.vulnerabilityLevelValue);
  }

  onInputBlurWithEventVulnerabilityLevelValue(event: any) {
    const vulnerabilityLevelValue = event.target.value;
    this.calculateRiskAssessmentValue(this.form.value.menaceLevelValue, vulnerabilityLevelValue);
  }


  calculateRiskAssessmentValue(menaceLevelValue: any, vulnerabilityLevelValue: any) {

    let riskAssessmentValue: any = '';

    if (!menaceLevelValue) {
      this.form.patchValue({
        riskAssessmentValue: ''
      })
      return;
    }
    if (!vulnerabilityLevelValue) {
      this.form.patchValue({
        riskAssessmentValue: ''
      })
      return;
    }


    riskAssessmentValue = (Number(menaceLevelValue) * Number(vulnerabilityLevelValue)) * this.valuationCID;


    this.riskTreatment.riskAssessmentValue = riskAssessmentValue;
    this.riskTreatment.riskLevelId = this.getRiskLevelId(riskAssessmentValue);
    this.riskTreatment.residualRiskId = this.getResidualRiskId(riskAssessmentValue);

    this.form.patchValue({
      riskAssessmentValue: riskAssessmentValue,
      riskLevelId: (this.riskTreatment.riskLevelId == 0) ? '' : this.riskTreatment.riskLevelId,
      residualRisklId: (this.riskTreatment.residualRiskId == 0) ? '' : this.riskTreatment.residualRiskId,
    })

  }

  getRiskLevelId(riskAssessmentValue: number) {

    let riskLevelId: number = 0;
    this.color = '';
    this.riskLevels.forEach((item: RiskLevel) => {
      if (riskAssessmentValue >= item.minimum && riskAssessmentValue <= item.maximum) {
        riskLevelId = item.riskLevelId;
        this.color = item.color;
      }

    });
    return riskLevelId;

  }

  getResidualRiskId(riskAssessmentValue: number) {

    let residualRiskId: number = 0;
    this.residualRisks.forEach((item: ResidualRisk) => {
      if (riskAssessmentValue >= item.minimum && riskAssessmentValue <= item.maximum) {
        residualRiskId = item.residualRiskId;
      }

    });
    return residualRiskId;

  }

  changeRiskLevel(value: number) {
    this.riskLevels.forEach((item: RiskLevel) => {
      if (value == item.riskLevelId) {
        this.color = item.color;
      }
    });

  }

  setRiskLevelColor(riskLevelId: number) {

    this.color = '';
    this.riskLevels.forEach((item: RiskLevel) => {
      if (item.riskLevelId == riskLevelId)
        this.color = item.color;
    });

  }

  close() {
    this.dialogRef.close();
  }

}

