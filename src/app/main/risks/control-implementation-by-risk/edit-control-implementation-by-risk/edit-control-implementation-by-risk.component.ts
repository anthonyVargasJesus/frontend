import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ControlImplementation } from 'app/models/control-implementation';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlImplementationService } from 'app/services/control-implementation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data'; import { Risk } from 'app/models/risk';

@Component({
  selector: 'app-edit-control-implementation-by-risk',
  templateUrl: './edit-control-implementation-by-risk.component.html',
  styles: [
  ]
})
export class EditControlImplementationByRiskComponent implements OnInit {


  @Input()
  controlImplementationId: number;

  constructor(
    private controlImplementationService: ControlImplementationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private responsibleService: ResponsibleService,

  ) { }

  responsibles: Responsible[] = [];
  controlImplementation: ControlImplementation;
  loading = false;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR CONTROLIMPLEMENTATION';;

  ngOnInit(): void {
    this.initForm();
    this.getAllResponsibles();
    this.initControlImplementation();


  }


  initControlImplementation() {
    this.controlImplementation = new ControlImplementation();
    this.initResponsible();
  }



  initResponsible() {
    if (this.responsibles.length > 0)
      this.controlImplementation.responsible = this.responsibles[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      activities: ['', [Validators.required, Validators.maxLength(500),]],
      startDate: ['', [Validators.required,]],
      verificationDate: ['', []],
      responsibleId: ['', [Validators.required,]],
      observation: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.controlImplementationService.obtain(id)
      .subscribe((res: any) => {
        this.controlImplementation = res.data;
        this.setFormValue(this.controlImplementation); 
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(controlImplementation: ControlImplementation) {
    this.form.setValue({
      activities: ((controlImplementation.activities == null) ? '' : controlImplementation.activities),
      startDate: ((controlImplementation.startDate == null) ? '' : controlImplementation.startDate),
      verificationDate: ((controlImplementation.verificationDate == null) ? '' : controlImplementation.verificationDate),
      responsibleId: ((controlImplementation.responsibleId == null) ? '' : controlImplementation.responsibleId),
      observation: ((controlImplementation.observation == null) ? '' : controlImplementation.observation),
    });
  }


  getFormValue() {
    this.controlImplementation.controlImplementationId = Number(this.controlImplementationId);
    this.controlImplementation.activities = this.form.value.activities;
    this.controlImplementation.startDate = this.form.value.startDate;
    this.controlImplementation.verificationDate = this.form.value.verificationDate;
    if (this.form.value.verificationDate == "")
      this.controlImplementation.verificationDate = null;
    this.controlImplementation.responsibleId = this.form.value.responsibleId;
    this.controlImplementation.observation = this.form.value.observation;
    if (this.form.value.observation == "")
      this.controlImplementation.observation = null;
  }

  getAllResponsibles() {
    // Por el momento solo se usa el ISO 27001, mas adelante se puede cambiar
    const ISO_27001_ID = 4;
    this.responsibleService.getAll(ISO_27001_ID)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.obtain(this.controlImplementationId.toString());
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


    this.controlImplementationService.update(this.controlImplementation)
      .subscribe(res => {
        this.controlImplementation = res.data;
        this.loading2 = false;
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }


}

