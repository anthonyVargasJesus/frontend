import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RiskAssessment } from 'app/models/risk-assessment';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskAssessmentService } from 'app/services/risk-assessment.service';
import { RiskLevelService } from 'app/services/risk-level.service';
import { RiskLevel } from 'app/models/risk-level';


@Component({
  selector: 'app-add-risk-assessment-by-risk',
  templateUrl: './add-risk-assessment-by-risk.component.html',
  styles: [
  ]
})


export class AddRiskAssessmentByRiskComponent implements OnInit {

  @Input()
  riskId: number;

  @Input()
  riskAssessmentId: number;

  @Input()
  valuationCID: number;

  @Output() childEvent = new EventEmitter<number>();
  
  constructor(
    private riskAssessmentService: RiskAssessmentService,
    public router: Router,private _formBuilder: FormBuilder, 
    private riskLevelService: RiskLevelService,
  ) { }

  riskLevels: RiskLevel[] = [];
  riskAssessment: RiskAssessment;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  public contentHeader: object; 

  color: string = '';

  ngOnInit(): void {
    this.initForm(); 
    this.initMenuName();
    this.getAllRiskLevels();
    this.initRiskAssessment();
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
      valuationCID: [{ value: this.valuationCID, disabled: true }, [Validators.required, Validators.maxLength(8),]],
      menaceLevelValue: ['', [Validators.required, Validators.maxLength(8),]],
      vulnerabilityLevelValue: ['', [Validators.required, Validators.maxLength(8),]],
      existingImplementedControls: ['', [Validators.required, Validators.maxLength(500),]],
      riskAssessmentValue: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(8),]],
      riskLevelId: ['', [Validators.required,]],
    });


  }

  initRiskAssessment() {
    this.riskAssessment = new RiskAssessment();
  }



  getAllRiskLevels() {
    this.riskLevelService.getAll()
      .subscribe((res: any) => {
        this.riskLevels = res.data;
        this.initRiskAssessment();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.riskAssessment.valuationCID = this.valuationCID;
    this.riskAssessment.menaceLevelValue = this.form.value.menaceLevelValue;
    this.riskAssessment.vulnerabilityLevelValue = this.form.value.vulnerabilityLevelValue;
    this.riskAssessment.existingImplementedControls = this.form.value.existingImplementedControls;
    //this.riskAssessment.riskAssessmentValue = this.form.value.riskAssessmentValue;
    this.riskAssessment.riskLevelId = Number(this.form.value.riskLevelId);
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

    this.riskAssessment.riskId = this.riskId;

    this.riskAssessmentService.insert(this.riskAssessment)
      .subscribe(res => {
        this.riskAssessment = res.data;
        this.loading2 = false;
        this.childEvent.emit(this.riskAssessment.riskAssessmentId);
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } 
  
  onInputBlurWithEventMenaceLevelValue(event: any) {
    const menaceLevelValue = event.target.value;
    this.riskAssessment.menaceLevelValue = this.form.value.menaceLevelValue;
    this.riskAssessment.vulnerabilityLevelValue = this.form.value.vulnerabilityLevelValue;
    this.calculateRiskAssessmentValue(menaceLevelValue,this.form.value.vulnerabilityLevelValue);
  }

  onInputBlurWithEventVulnerabilityLevelValue(event: any) {
    const vulnerabilityLevelValue = event.target.value;
    this.calculateRiskAssessmentValue(this.form.value.menaceLevelValue,vulnerabilityLevelValue);
  }


  calculateRiskAssessmentValue(menaceLevelValue:any, vulnerabilityLevelValue:any) {

    console.log('menaceLevelValue',menaceLevelValue);
    console.log('vulnerabilityLevelValue',vulnerabilityLevelValue); 

    let riskAssessmentValue:any = '';

    if (!menaceLevelValue){
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
    this.riskLevels.forEach((item: RiskLevel) =>{
      if (riskAssessmentValue >= item.minimum && riskAssessmentValue <= item.maximum){
        riskLevelId = item.riskLevelId;
        this.color = item.color;
      }
       
    });
    return riskLevelId;

  }

  changeRiskLevel(value: number) {
    this.riskLevels.forEach((item: RiskLevel) =>{
      if (value == item.riskLevelId){
          this.color = item.color;
      }
    });

  }
  
}

