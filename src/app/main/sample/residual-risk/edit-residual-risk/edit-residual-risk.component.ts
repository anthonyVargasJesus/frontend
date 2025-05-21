import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ResidualRisk } from 'app/models/residual-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ResidualRiskService } from 'app/services/residual-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-residual-risk',
  templateUrl: './edit-residual-risk.component.html',
  styles: [
  ]
})
export class EditResidualRiskComponent implements OnInit {

  constructor(
    private residualRiskService: ResidualRiskService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditResidualRiskComponent>,

  ) { }


  residualRisk: ResidualRisk;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR RESIDUALRISK';;

  ngOnInit(): void {
    this.initForm();


    this.initResidualRisk();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initResidualRisk() {
    this.residualRisk = new ResidualRisk();
  }







  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      factor: ['', [Validators.maxLength(5),]],
      minimum: ['', [Validators.maxLength(5),]],
      maximum: ['', [Validators.maxLength(5),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.residualRiskService.obtain(id)
      .subscribe((res: any) => {
        this.residualRisk = res.data;
        this.setFormValue(this.residualRisk); this.title = this.residualRisk.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(residualRisk: ResidualRisk) {
    this.form.setValue({
      name: ((residualRisk.name == null) ? '' : residualRisk.name),
      description: ((residualRisk.description == null) ? '' : residualRisk.description),
      abbreviation: ((residualRisk.abbreviation == null) ? '' : residualRisk.abbreviation),
      factor: ((residualRisk.factor == null) ? '' : residualRisk.factor),
      minimum: ((residualRisk.minimum == null) ? '' : residualRisk.minimum),
      maximum: ((residualRisk.maximum == null) ? '' : residualRisk.maximum),
      color: ((residualRisk.color == null) ? '' : residualRisk.color),
    });
  }


  getFormValue() {
    this.residualRisk.residualRiskId = Number(this.id);
    this.residualRisk.name = this.form.value.name;
    this.residualRisk.description = this.form.value.description;
    if (this.form.value.description == "")
      this.residualRisk.description = null;
    this.residualRisk.abbreviation = this.form.value.abbreviation;
    this.residualRisk.factor = this.form.value.factor;
    if (this.form.value.factor == "")
      this.residualRisk.factor = null;
    this.residualRisk.minimum = this.form.value.minimum;
    if (this.form.value.minimum == "")
      this.residualRisk.minimum = null;
    this.residualRisk.maximum = this.form.value.maximum;
    if (this.form.value.maximum == "")
      this.residualRisk.maximum = null;
    this.residualRisk.color = this.form.value.color;
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



    this.residualRiskService.update(this.residualRisk)
      .subscribe(res => {
        this.residualRisk = res.data;
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

