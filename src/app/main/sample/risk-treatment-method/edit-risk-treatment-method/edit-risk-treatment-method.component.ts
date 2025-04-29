import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RiskTreatmentMethod } from 'app/models/risk-treatment-method';
import { ErrorManager } from 'app/errors/error-manager';
import { RiskTreatmentMethodService } from 'app/services/risk-treatment-method.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-risk-treatment-method',
  templateUrl: './edit-risk-treatment-method.component.html',
  styles: [
  ]
})
export class EditRiskTreatmentMethodComponent implements OnInit {

  constructor(
    private riskTreatmentMethodService: RiskTreatmentMethodService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRiskTreatmentMethodComponent>,

  ) { }


  riskTreatmentMethod: RiskTreatmentMethod;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR MÉTODO DE TRATAMIENTO';

  ngOnInit(): void {
    this.initForm();


    this.initRiskTreatmentMethod();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initRiskTreatmentMethod() {
    this.riskTreatmentMethod = new RiskTreatmentMethod();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.riskTreatmentMethodService.obtain(id)
      .subscribe((res: any) => {
        this.riskTreatmentMethod = res.data;
        this.setFormValue(this.riskTreatmentMethod); this.title = this.riskTreatmentMethod.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(riskTreatmentMethod: RiskTreatmentMethod) {
    this.form.setValue({
      name: ((riskTreatmentMethod.name == null) ? '' : riskTreatmentMethod.name),
      description: ((riskTreatmentMethod.description == null) ? '' : riskTreatmentMethod.description),
    });
  }


  getFormValue() {
    this.riskTreatmentMethod.riskTreatmentMethodId = Number(this.id);
    this.riskTreatmentMethod.name = this.form.value.name;
    this.riskTreatmentMethod.description = this.form.value.description;
    if (this.form.value.description == "")
      this.riskTreatmentMethod.description = null;
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



    this.riskTreatmentMethodService.update(this.riskTreatmentMethod)
      .subscribe(res => {
        this.riskTreatmentMethod = res.data;
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

