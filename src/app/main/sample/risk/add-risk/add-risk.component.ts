import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Risk } from 'app/models/risk';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskService } from 'app/services/risk.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivesInventoryService } from 'app/services/actives-inventory.service';
import { ActivesInventory } from 'app/models/actives-inventory';
import { MenaceService } from 'app/services/menace.service';
import { Menace } from 'app/models/menace';
import { VulnerabilityService } from 'app/services/vulnerability.service';
import { Vulnerability } from 'app/models/vulnerability';
import { ControlService } from 'app/services/control.service';
import { Control } from 'app/models/control';
import { RiskLevelService } from 'app/services/risk-level.service';
import { RiskLevel } from 'app/models/risk-level';
import { ControlTypeService } from 'app/services/control-type.service';
import { ControlType } from 'app/models/control-type';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';



@Component({
  selector: 'app-add-risk',
  templateUrl: './add-risk.component.html',
  styles: [
  ]
})


export class AddRiskComponent implements OnInit {

  constructor(
    private riskService: RiskService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRiskComponent>, private activesInventoryService: ActivesInventoryService,
    private menaceService: MenaceService,
    private vulnerabilityService: VulnerabilityService,
    private controlService: ControlService,
    private riskLevelService: RiskLevelService,
    private controlTypeService: ControlTypeService,
    private responsibleService: ResponsibleService,


  ) { }

  activesInventories: ActivesInventory[] = [];
  menaces: Menace[] = [];
  vulnerabilities: Vulnerability[] = [];
  controls: Control[] = [];
  riskLevels: RiskLevel[] = [];
  controlTypes: ControlType[] = [];
  responsibles: Responsible[] = [];

  risk: Risk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  standardId: number = 4;

  ngOnInit(): void {
    this.initForm();
    this.getAllActivesInventories();
    this.getAllMenaces();
    this.getAllVulnerabilities();
    this.getAllControls();
    this.getAllRiskLevels();
    this.getAllControlTypes();
    this.getAllResponsibles();

    this.initRisk();

  }

  initForm() {
    this.form = this._formBuilder.group({
      activesInventory: ['', [Validators.required,]],
      activesInventoryNumber: ['', [Validators.maxLength(20),]],
      macroProcess: ['', [Validators.maxLength(100),]],
      subProcess: ['', [Validators.maxLength(100),]],
      activesInventoryName: ['', [Validators.maxLength(250),]],
      activesInventoryValuation: ['', [Validators.maxLength(8),]],
      menace: ['', [Validators.required,]],
      vulnerability: ['', [Validators.required,]],
      menaceLevel: ['', [Validators.required, Validators.maxLength(8),]],
      vulnerabilityLevel: ['', [Validators.required, Validators.maxLength(8),]],
      control: ['', [Validators.required,]],
      riskAssessmentValue: ['', [Validators.required, Validators.maxLength(8),]],
      riskLevel: ['', [Validators.required,]],
      treatmentMethod: ['', [Validators.required, Validators.maxLength(250),]],
      controlType: ['', [Validators.required,]],
      controlsToImplement: ['', [Validators.maxLength(500),]],
      menaceLevelWithTreatment: ['', [Validators.maxLength(8),]],
      vulnerabilityLevelWithTreatment: ['', [Validators.maxLength(8),]],
      riskAssessmentValueWithTreatment: ['', [Validators.required, Validators.maxLength(8),]],
      riskLevelWithImplementedControlld: ['', [Validators.required, Validators.maxLength(8),]],
      residualRisk: ['', [Validators.required, Validators.maxLength(200),]],
      activities: ['', [Validators.maxLength(200),]],
      implementationStartDate: ['', []],
      verificationDate: ['', []],
      responsible: ['', []],
      observation: ['', [Validators.maxLength(500),]],
    });
  }

  initRisk() {
    this.risk = new Risk();
  }



  getAllActivesInventories() {
    // this.activesInventoryService.getAll()
    //   .subscribe((res: any) => {
    //     this.activesInventories = res.data;
    //     this.initRisk();
    //   }, error => {
    //     ErrorManager.handleError(error);
    //   });
  }



  getAllMenaces() {
    this.menaceService.getAll()
      .subscribe((res: any) => {
        this.menaces = res.data;
        this.initRisk();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllVulnerabilities() {
    this.vulnerabilityService.getAll()
      .subscribe((res: any) => {
        this.vulnerabilities = res.data;
        this.initRisk();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllControls() {
    // this.controlService.getAll()
    //   .subscribe((res: any) => {
    //     this.controls = res.data;
    //     this.initRisk();
    //   }, error => {
    //     ErrorManager.handleError(error);
    //   });
  }


  getAllRiskLevels() {
    this.riskLevelService.getAll()
      .subscribe((res: any) => {
        this.riskLevels = res.data;
        this.initRisk();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllControlTypes() {
    this.controlTypeService.getAll()
      .subscribe((res: any) => {
        this.controlTypes = res.data;
        this.initRisk();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllResponsibles() {
    // this.responsibleService.getAll()
    //   .subscribe((res: any) => {
    //     this.responsibles = res.data;
    //     this.initRisk();
    //   }, error => {
    //     ErrorManager.handleError(error);
    //   });
  }



  getFormValue() {
    this.risk.activesInventoryId = this.form.value.activesInventory;
    this.risk.activesInventoryNumber = this.form.value.activesInventoryNumber;
    this.risk.macroProcess = this.form.value.macroProcess;
    this.risk.subProcess = this.form.value.subProcess;
    this.risk.activesInventoryName = this.form.value.activesInventoryName;
    this.risk.activesInventoryValuation = this.form.value.activesInventoryValuation;
    this.risk.menaceId = this.form.value.menace;
    this.risk.vulnerabilityId = this.form.value.vulnerability;
    this.risk.menaceLevel = this.form.value.menaceLevel;
    this.risk.vulnerabilityLevel = this.form.value.vulnerabilityLevel;
    this.risk.controlId = this.form.value.control;
    this.risk.riskAssessmentValue = this.form.value.riskAssessmentValue;
    this.risk.riskLevelId = this.form.value.riskLevel;
    this.risk.treatmentMethod = this.form.value.treatmentMethod;
    this.risk.controlTypeId = this.form.value.controlType;
    this.risk.controlsToImplement = this.form.value.controlsToImplement;
    this.risk.menaceLevelWithTreatment = this.form.value.menaceLevelWithTreatment;
    this.risk.vulnerabilityLevelWithTreatment = this.form.value.vulnerabilityLevelWithTreatment;
    this.risk.riskAssessmentValueWithTreatment = this.form.value.riskAssessmentValueWithTreatment;
    this.risk.riskLevelWithImplementedControlld = this.form.value.riskLevelWithImplementedControlld;
    this.risk.residualRisk = this.form.value.residualRisk;
    this.risk.activities = this.form.value.activities;
    this.risk.implementationStartDate = this.form.value.implementationStartDate;
    this.risk.verificationDate = this.form.value.verificationDate;
    this.risk.responsibleId = this.form.value.responsible;
    this.risk.observation = this.form.value.observation;
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

    // if (this.risk.responsible._id == '')
    //   this.risk.responsible = null;

    this.riskService.insert(this.risk)
      .subscribe(res => {
        this.risk = res.data;
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

