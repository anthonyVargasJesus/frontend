import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DefaultRisk } from 'app/models/default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { DefaultRiskService } from 'app/services/default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenaceService } from 'app/services/menace.service';
import { Menace } from 'app/models/menace';
import { VulnerabilityService } from 'app/services/vulnerability.service';
import { Vulnerability } from 'app/models/vulnerability';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-default-risk',
  templateUrl: './edit-default-risk.component.html',
  styles: [
  ]
})


export class EditDefaultRiskComponent implements OnInit {

  constructor(
    private defaultRiskService: DefaultRiskService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private menaceService: MenaceService,
    private vulnerabilityService: VulnerabilityService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditDefaultRiskComponent>,

  ) { }

  menaces: Menace[] = [];
  vulnerabilities: Vulnerability[] = [];

  defaultRisk: DefaultRisk;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR RIESGO SUGERIDO';

  ngOnInit(): void {
    this.initDefaultRisk();
    this.initForm();
    this.id = this.data['_id'];
    this.getAllMenaces();
  }

  initDefaultRisk() {
    this.defaultRisk = new DefaultRisk();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      menaceId: ['', [Validators.required,]],
      vulnerabilityId: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.defaultRiskService.obtain(id)
      .subscribe((res: any) => {
        this.defaultRisk = res.data;
        this.setFormValue(this.defaultRisk); this.title = this.defaultRisk.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(defaultRisk: DefaultRisk) {
    this.form.setValue({
      name: ((defaultRisk.name == null) ? '' : defaultRisk.name),
      menaceId: ((defaultRisk.menaceId == null) ? '' : defaultRisk.menaceId),
      vulnerabilityId: ((defaultRisk.vulnerabilityId == null) ? '' : defaultRisk.vulnerabilityId),
    });
  }


  getFormValue() {
    this.defaultRisk.defaultRiskId = Number(this.id);
    this.defaultRisk.name = this.form.value.name;
    this.defaultRisk.menaceId = this.form.value.menaceId;
    this.defaultRisk.vulnerabilityId = this.form.value.vulnerabilityId;
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



    this.defaultRiskService.update(this.defaultRisk)
      .subscribe(res => {
        this.defaultRisk = res.data;
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
