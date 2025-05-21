import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RiskTreatment } from 'app/models/risk-treatment';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskTreatmentService } from 'app/services/risk-treatment.service';

import { RiskTreatmentMethodService } from 'app/services/risk-treatment-method.service';
import { RiskTreatmentMethod } from 'app/models/risk-treatment-method';
import { RiskLevelService } from 'app/services/risk-level.service';
import { RiskLevel } from 'app/models/risk-level';

import { Risk } from 'app/models/risk';
import { DialogData } from 'app/models/dialog-data';
import { ResidualRiskService } from 'app/services/residual-risk.service';
import { ResidualRisk } from 'app/models/residual-risk';


@Component({
  selector: 'app-add-risk-treatment-by-risk',
  templateUrl: './add-risk-treatment-by-risk.component.html',
  styles: [
  ]
})


export class AddRiskTreatmentByRiskComponent implements OnInit {

  @Input()
  riskId: number;

  @Input()
  valuationCID: number;

  @Output() childEvent2 = new EventEmitter<number>();

  constructor(
    private riskTreatmentService: RiskTreatmentService,
    public router: Router,
    private _formBuilder: FormBuilder, private riskTreatmentMethodService: RiskTreatmentMethodService,
    private riskLevelService: RiskLevelService, private residualRiskService: ResidualRiskService,


  ) { }

  riskTreatmentMethods: RiskTreatmentMethod[] = [];
  riskLevels: RiskLevel[] = [];
  residualRisks: ResidualRisk[] = [];
  
  riskTreatment: RiskTreatment;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  public contentHeader: object;

  color: string = '';

  ngOnInit(): void {

    this.getAllRiskTreatmentMethods();


    this.initForm();
    this.initMenuName();


    this.initRiskTreatment();

  } 
  
  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Product',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Product',
            isLink: false,
            link: '#'
          },
          {
            name: 'Product',
            isLink: false
          }
        ]
      }
    }
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

  initRiskTreatment() {
    this.riskTreatment = new RiskTreatment();
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

  getAllResidualRisks() {
    this.residualRiskService.getAll()
      .subscribe((res: any) => {
        this.residualRisks = res.data;
      this.initRiskTreatment();
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



  getFormValue() {
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






  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.riskTreatment.riskId = this.riskId;

    this.riskTreatmentService.insert(this.riskTreatment)
      .subscribe(res => {
        this.riskTreatment = res.data;
        this.loading2 = false;
        this.childEvent2.emit(this.riskTreatment.riskTreatmentId);
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

    console.log('menaceLevelValue', menaceLevelValue);
    console.log('vulnerabilityLevelValue', vulnerabilityLevelValue);

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

    console.log(' this.riskTreatment.residualRisklId',  this.riskTreatment.residualRiskId)

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

}

