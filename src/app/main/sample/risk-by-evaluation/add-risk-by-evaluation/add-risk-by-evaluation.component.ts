import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Risk } from 'app/models/risk';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskService } from 'app/services/risk.service';

import { ActivesInventoryService } from 'app/services/actives-inventory.service';
import { ActivesInventory } from 'app/models/actives-inventory';
import { MenaceService } from 'app/services/menace.service';
import { Menace } from 'app/models/menace';
import { VulnerabilityService } from 'app/services/vulnerability.service';
import { Vulnerability } from 'app/models/vulnerability';

import { Evaluation } from 'app/models/evaluation';
import { DialogData } from 'app/models/dialog-data';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-add-risk-by-evaluation',
  templateUrl: './add-risk-by-evaluation.component.html',
  styles: [
  ]
})


export class AddRiskByEvaluationComponent implements OnInit {

  constructor(
    private riskService: RiskService,
    public router: Router,
    private _formBuilder: FormBuilder, private activesInventoryService: ActivesInventoryService,
    private menaceService: MenaceService,
    private vulnerabilityService: VulnerabilityService,
    private route: ActivatedRoute, 
  ) { }

  activesInventories: ActivesInventory[] = [];
  menaces: Menace[] = [];
  vulnerabilities: Vulnerability[] = [];

  risk: Risk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  public contentHeader: object; 
  
  evaluationId: string;

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.evaluationId = params.get('id').toString();
    });

    this.initForm(); 
    this.initMenuName();
    this.getAllActivesInventories();
    this.getAllMenaces();
    this.getAllVulnerabilities();

 

    this.initRisk();

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
      activesInventoryId: ['', [Validators.required,]],
      activesInventoryNumber: ['', [Validators.maxLength(20),]],
      activesInventoryName: ['', [Validators.maxLength(100),]],
      menaceId: ['', [Validators.required,]],
      vulnerabilityId: ['', [Validators.required,]],
    });
  }

  initRisk() {
    this.risk = new Risk();
  }



  getAllActivesInventories() {
    this.activesInventoryService.getAll()
      .subscribe((res: any) => {
        this.activesInventories = res.data;
        this.initRisk();
      }, error => {
        ErrorManager.handleError(error);
      });
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



  getFormValue() {
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






  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.risk.evaluationId = Number(this.evaluationId);

    this.riskService.insert(this.risk)
      .subscribe(res => {
        this.risk = res.data;
        this.loading2 = false; 
        this.router.navigate(['/edit-risk', this.risk.riskId]);
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } navigateToBack() {
    this.router.navigate(['/risk']);
  }
}
