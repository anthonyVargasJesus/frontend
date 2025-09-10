import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { DefaultRisk } from 'app/models/default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { DefaultRiskService } from 'app/services/default-risk.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenaceService } from 'app/services/menace.service';
import { Menace } from 'app/models/menace';
import { VulnerabilityService } from 'app/services/vulnerability.service';
import { Vulnerability } from 'app/models/vulnerability';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-default-risk',
  templateUrl: './add-default-risk.component.html',
  styles: [
  ]
})
export class AddDefaultRiskComponent implements OnInit {

  constructor(
    private defaultRiskService: DefaultRiskService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddDefaultRiskComponent>, private menaceService: MenaceService,
    private vulnerabilityService: VulnerabilityService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  menaces: Menace[] = [];
  vulnerabilities: Vulnerability[] = [];

  defaultRisk: DefaultRisk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  standardId: number;

  ngOnInit(): void {
    this.standardId = this.data['standardId'];
    this.initDefaultRisk();
    this.initForm();
    this.getAllMenaces();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      menaceId: ['', [Validators.required,]],
      vulnerabilityId: ['', [Validators.required,]],
    });
  }

  initDefaultRisk() {
    this.defaultRisk = new DefaultRisk();
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
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.defaultRisk.name = this.form.value.name;
    this.defaultRisk.menaceId = this.form.value.menaceId;
    this.defaultRisk.vulnerabilityId = this.form.value.vulnerabilityId;
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

    this.defaultRisk.standardId = this.standardId;

    this.defaultRiskService.insert(this.defaultRisk)
      .subscribe(res => {
        this.defaultRisk = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}
