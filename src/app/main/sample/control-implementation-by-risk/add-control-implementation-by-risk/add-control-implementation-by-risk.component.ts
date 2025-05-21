import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ControlImplementation } from 'app/models/control-implementation';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlImplementationService } from 'app/services/control-implementation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';

@Component({
  selector: 'app-add-control-implementation-by-risk',
  templateUrl: './add-control-implementation-by-risk.component.html',
  styles: [
  ]
})


export class AddControlImplementationByRiskComponent implements OnInit {

   @Input()
   riskId: number;
 
   @Input()
   controlImplementationId: number;
   
  constructor(
    private controlImplementationService: ControlImplementationService,
    private _formBuilder: FormBuilder, private responsibleService: ResponsibleService,

  ) { }

  responsibles: Responsible[] = [];

  controlImplementation: ControlImplementation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  @Output() childEvent3 = new EventEmitter<number>();
  
  ngOnInit(): void {
    this.initForm();
    this.getAllResponsibles();
    this.initControlImplementation();
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

  initControlImplementation() {
    this.controlImplementation = new ControlImplementation();
  }


  getAllResponsibles() {
    // Por el momento solo se usa el ISO 27001, mas adelante se puede cambiar
    const ISO_27001_ID = 4;
    this.responsibleService.getAll(ISO_27001_ID)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.initControlImplementation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.controlImplementation.riskId = this.riskId;

    this.controlImplementationService.insert(this.controlImplementation)
      .subscribe(res => {
        this.controlImplementation = res.data;
        this.loading2 = false;
        this.childEvent3.emit(this.controlImplementation.controlImplementationId);
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } 
}

