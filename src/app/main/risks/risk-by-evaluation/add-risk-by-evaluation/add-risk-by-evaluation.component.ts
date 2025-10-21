import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
import { DialogData } from 'app/models/dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


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
    private dialogRef: MatDialogRef<AddRiskByEvaluationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
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
  defaultRisk: Risk = new Risk();
  breachId?: number;

  ngOnInit(): void {
    this.evaluationId = this.data['evaluationId'];
    this.defaultRisk = this.data['defaultRisk'];
    this.breachId = this.data['breachId'];
    this.initForm();
    this.getAllActivesInventories();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      activesInventoryId: ['', [Validators.required,]],
      activesInventoryNumber: ['', [Validators.maxLength(20),]],
      activesInventoryName: ['', [Validators.maxLength(100),]],
      menaceId: ['', [Validators.required,]],
      vulnerabilityId: ['', [Validators.required,]],
    });
  }

  initRisk() {
    this.risk = new Risk();
    if (this.defaultRisk) {
      console.log(this.defaultRisk);
      this.form.patchValue({
        name: this.defaultRisk.name,
        activesInventoryId: '',
        menaceId: this.defaultRisk.menaceId,
        vulnerabilityId: this.defaultRisk.vulnerabilityId,
      });
    }
  }

  getAllActivesInventories() {
    this.loading = true;
    this.activesInventoryService.getAll()
      .subscribe((res: any) => {
        this.activesInventories = res.data;
        this.loading = false;
        this.getAllMenaces();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  getAllMenaces() {
    this.loading = true;
    this.menaceService.getAll()
      .subscribe((res: any) => {
        this.menaces = res.data;
        this.loading = false;
        this.getAllVulnerabilities();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  getAllVulnerabilities() {
    this.loading = true;
    this.vulnerabilityService.getAll()
      .subscribe((res: any) => {
        this.vulnerabilities = res.data;
        this.loading = false;
        this.initRisk();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.risk.activesInventoryId = this.form.value.activesInventoryId;
    this.risk.name = this.form.value.name;
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
    if (this.defaultRisk)
      this.risk.breachId = Number(this.breachId);

    this.riskService.insert(this.risk)
      .subscribe(res => {
        this.risk = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  changeActiveInventory(value: number) {

    let activesInventoryNumber = '';
    let activesInventoryName = '';

    this.activesInventories.forEach((activesInventory) => {
      if (activesInventory.activesInventoryId == value) {
        activesInventoryNumber = activesInventory.number;
        activesInventoryName = activesInventory.name;
      }
    });

    this.form.patchValue({
      activesInventoryNumber: activesInventoryNumber,
      activesInventoryName: activesInventoryName,
    });

  }

  close() {
    this.dialogRef.close();
  }

}
