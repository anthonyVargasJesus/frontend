import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Risk } from 'app/models/risk';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskService } from 'app/services/risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivesInventoryService } from 'app/services/actives-inventory.service';
import { ActivesInventory } from 'app/models/actives-inventory';
import { MenaceService } from 'app/services/menace.service';
import { Menace } from 'app/models/menace';
import { VulnerabilityService } from 'app/services/vulnerability.service';
import { Vulnerability } from 'app/models/vulnerability';
import { DialogData } from 'app/models/dialog-data'; import { Evaluation } from 'app/models/evaluation';

@Component({
  selector: 'app-edit-risk-by-evaluation',
  templateUrl: './edit-risk-by-evaluation.component.html',
  styles: [
  ]
})

export class EditRiskByEvaluationComponent implements OnInit {

  constructor(
    private riskService: RiskService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private activesInventoryService: ActivesInventoryService,
    private menaceService: MenaceService,
    private vulnerabilityService: VulnerabilityService,


  ) { }

  activesInventories: ActivesInventory[] = [];
  menaces: Menace[] = [];
  vulnerabilities: Vulnerability[] = [];

  risk: Risk;
  loading = false;
  id: string;
  loading2 = false;
  public contentHeader: object;
  public form: FormGroup;
  public submitted = false;

  public title: string = 'EDITAR RIESGO';


  riskAssessmentId: number = 0;
  valuationCID: number = 0;

  riskTreatmentId: number = 0;
  controlImplementationId: number = 0;


  ngOnInit(): void {
    this.initForm();
    this.initMenuName(); 
    this.getAllMenaces();
    this.initRisk();
  }


  initRisk() {
    this.risk = new Risk();
    this.initActivesInventory();
    this.initMenace();
    this.initVulnerability();
  }
  initActivesInventory() {
    if (this.activesInventories.length > 0)
      this.risk.activesInventory = this.activesInventories[0];
  }



  initMenace() {
    if (this.menaces.length > 0)
      this.risk.menace = this.menaces[0];
  }

  initVulnerability() {
    if (this.vulnerabilities.length > 0)
      this.risk.vulnerability = this.vulnerabilities[0];
  }

  initForm() {
    this.form = this._formBuilder.group({
      activesInventoryId: ['', [Validators.required,]],
      activesInventoryNumber: ['', [Validators.maxLength(20),]],
      activesInventoryName: ['', [Validators.maxLength(100),]],
      menaceId: ['', [Validators.required,]],
      vulnerabilityId: ['', [Validators.required,]],
    });
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Evaluación de riesgos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'EVALUACIÓN',
            isLink: false,
            link: '#'
          },
          {
            name: 'Riesgos',
            isLink: false
          },
        ]
      }
    }

  }

  obtain(id: string) {
    this.loading = true;
    this.riskService.obtain(id)
      .subscribe((res: any) => {
        this.risk = res.data;

        this.riskAssessmentId = this.risk.riskAssessmentId;
        this.valuationCID = this.risk.valuationCID;

        this.riskTreatmentId = this.risk.riskTreatmentId;
        this.controlImplementationId = this.risk.controlImplementationId;

        this.setFormValue(this.risk);

        if (this.risk)
          if (this.risk.activesInventoryName)
            this.title = this.risk.activesInventoryNumber + ' - ' + this.risk.activesInventoryName.toUpperCase();

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(risk: Risk) {
    this.form.setValue({
      activesInventoryId: ((risk.activesInventoryId == null) ? '' : risk.activesInventoryId),
      activesInventoryNumber: ((risk.activesInventoryNumber == null) ? '' : risk.activesInventoryNumber),
      activesInventoryName: ((risk.activesInventoryName == null) ? '' : risk.activesInventoryName),
      menaceId: ((risk.menaceId == null) ? '' : risk.menaceId),
      vulnerabilityId: ((risk.vulnerabilityId == null) ? '' : risk.vulnerabilityId),
    });
  }


  getFormValue() {
    this.risk.riskId = Number(this.id);
    this.risk.activesInventoryId = this.form.value.activesInventoryId;
    this.risk.activesInventoryNumber = this.form.value.activesInventoryNumber;
    if (this.form.value.activesInventoryNumber == "")
      this.risk.activesInventoryNumber = null;
    this.risk.activesInventoryName = this.form.value.activesInventoryName;
    if (this.form.value.activesInventoryName == "")
      this.risk.activesInventoryName = null;
    this.risk.menaceId = this.form.value.menaceId;
    this.risk.vulnerabilityId = this.form.value.vulnerabilityId;
  }

  getAllActivesInventories() {
    this.activesInventoryService.getAll()
      .subscribe((res: any) => {
        this.activesInventories = res.data;
        this.route.paramMap.subscribe((params: ParamMap) => {
          this.id = params.get('id').toString();
          this.obtain(this.id);
        });
      }, error => {
        ErrorManager.handleError(error);
      });
  }
  getAllMenaces() {
    this.menaceService.getAll()
      .subscribe((res: any) => {
        this.menaces = res.data;
        this.getAllVulnerabilities();
      }, error => {
        ErrorManager.handleError(error);
      });
  }
  getAllVulnerabilities() {
    this.vulnerabilityService.getAll()
      .subscribe((res: any) => {
        this.vulnerabilities = res.data;
        this.getAllActivesInventories();
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



    this.riskService.update(this.risk)
      .subscribe(res => {
        this.risk = res.data; this.loading2 = false;


      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  navigateToBack() {
    this.router.navigate(['/current-risks']);
  }

  childEvent(riskAssessmentId: number) {
    this.riskAssessmentId = riskAssessmentId;

  }

  childEvent2(riskTreatmentId: number) {
    this.riskTreatmentId = riskTreatmentId;
  }

  childEvent3(controlImplementationId: number) {
    this.controlImplementationId = controlImplementationId;
  }

}

