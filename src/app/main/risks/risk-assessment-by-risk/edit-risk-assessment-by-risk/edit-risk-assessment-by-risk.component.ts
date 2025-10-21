import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RiskAssessment } from 'app/models/risk-assessment';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskAssessmentService } from 'app/services/risk-assessment.service';
import { RiskLevelService } from 'app/services/risk-level.service';
import { RiskLevel } from 'app/models/risk-level';
import { Risk } from 'app/models/risk';
import { DialogData } from 'app/models/dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RiskService } from 'app/services/risk.service';

@Component({
  selector: 'app-edit-risk-assessment-by-risk',
  templateUrl: './edit-risk-assessment-by-risk.component.html',
  styles: [
  ]
})
export class EditRiskAssessmentByRiskComponent implements OnInit {

  riskAssessmentId: number;
  valuationCID: number;
  selectedRisk: Risk = new Risk();

  constructor(
    private riskAssessmentService: RiskAssessmentService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private riskLevelService: RiskLevelService,
    private dialogRef: MatDialogRef<EditRiskAssessmentByRiskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private riskService: RiskService,
  ) { }

  riskLevels: RiskLevel[] = [];
  riskId: string;

  riskAssessment: RiskAssessment;
  loading = false;
  loading2 = false;
  public contentHeader: object; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR';

  color: string = '';

  ngOnInit(): void {
    this.riskAssessmentId = this.data['riskAssessmentId'];
    this.riskId = this.data['riskId'];

    this.initForm();
    this.initMenuName();
    this.obtainRisk();
    this.initRiskAssessment();
  }

  obtainRisk() {
    this.loading = true;
    this.riskService.obtain(this.riskId.toString())
      .subscribe((res: any) => {
        this.selectedRisk = res.data;
        this.valuationCID = this.selectedRisk.valuationCID;
        this.initForm();
        this.getAllRiskLevels();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  initRiskAssessment() {
    this.riskAssessment = new RiskAssessment();
    this.initRiskLevel();
  }





  initRiskLevel() {
    if (this.riskLevels.length > 0)
      this.riskAssessment.riskLevel = this.riskLevels[0];
  }

  initForm() {
    this.form = this._formBuilder.group({
      valuationCID: ['', [Validators.required, Validators.maxLength(8),]],
      menaceLevelValue: ['', [Validators.required, Validators.maxLength(8),]],
      vulnerabilityLevelValue: ['', [Validators.required, Validators.maxLength(8),]],
      existingImplementedControls: ['', [Validators.required, Validators.maxLength(500),]],
      riskAssessmentValue: ['', [Validators.required, Validators.maxLength(8),]],
      riskLevelId: ['', [Validators.required,]],
    });
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

  obtain(id: number) {
    this.loading = true;
    this.riskAssessmentService.obtain(id)
      .subscribe((res: any) => {
        this.riskAssessment = res.data;
        console.log(res);
        this.valuationCID = this.riskAssessment.valuationCID;
        this.setFormValue(this.riskAssessment);
        this.setRiskLevelColor(this.riskAssessment.riskLevelId);
        //this.title = this.riskAssessment.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(riskAssessment: RiskAssessment) {
    this.form.setValue({
      valuationCID: ((riskAssessment.valuationCID == null) ? '' : riskAssessment.valuationCID),
      menaceLevelValue: ((riskAssessment.menaceLevelValue == null) ? '' : riskAssessment.menaceLevelValue),
      vulnerabilityLevelValue: ((riskAssessment.vulnerabilityLevelValue == null) ? '' : riskAssessment.vulnerabilityLevelValue),
      existingImplementedControls: ((riskAssessment.existingImplementedControls == null) ? '' : riskAssessment.existingImplementedControls),
      riskAssessmentValue: ((riskAssessment.riskAssessmentValue == null) ? '' : riskAssessment.riskAssessmentValue),
      riskLevelId: ((riskAssessment.riskLevelId == null) ? '' : riskAssessment.riskLevelId),
    });
  }


  getFormValue() {
    this.riskAssessment.riskAssessmentId = Number(this.riskAssessmentId);
    this.riskAssessment.valuationCID = this.form.value.valuationCID;
    this.riskAssessment.menaceLevelValue = this.form.value.menaceLevelValue;
    this.riskAssessment.vulnerabilityLevelValue = this.form.value.vulnerabilityLevelValue;
    this.riskAssessment.existingImplementedControls = this.form.value.existingImplementedControls;
    this.riskAssessment.riskAssessmentValue = this.form.value.riskAssessmentValue;
    this.riskAssessment.riskLevelId = this.form.value.riskLevelId;
  }

  getAllRiskLevels() {
    this.riskLevelService.getAll()
      .subscribe((res: any) => {
        this.riskLevels = res.data;
        this.obtain(this.riskAssessmentId);
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


    this.riskAssessmentService.update(this.riskAssessment)
      .subscribe(res => {
        this.riskAssessment = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }


  onInputBlurWithEventMenaceLevelValue(event: any) {
    const menaceLevelValue = event.target.value;
    this.riskAssessment.menaceLevelValue = this.form.value.menaceLevelValue;
    this.riskAssessment.vulnerabilityLevelValue = this.form.value.vulnerabilityLevelValue;
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
    console.log('fdsfsd', riskAssessmentValue)

    this.riskAssessment.riskAssessmentValue = riskAssessmentValue;
    this.riskAssessment.riskLevelId = this.getRiskLevelId(riskAssessmentValue);

    this.form.patchValue({
      riskAssessmentValue: riskAssessmentValue,
      riskLevelId: (this.riskAssessment.riskLevelId == 0) ? '' : this.riskAssessment.riskLevelId,
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

