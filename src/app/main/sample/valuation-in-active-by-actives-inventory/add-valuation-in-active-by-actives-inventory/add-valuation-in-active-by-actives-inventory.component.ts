import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ValuationInActive } from 'app/models/valuation-in-active';
import { ErrorManager } from 'app/errors/error-manager';
import { ValuationInActiveService } from 'app/services/valuation-in-active.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImpactValuationService } from 'app/services/impact-valuation.service';
import { ImpactValuation } from 'app/models/impact-valuation';

import { ActivesInventory } from 'app/models/actives-inventory';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-valuation-in-active-by-actives-inventory',
  templateUrl: './add-valuation-in-active-by-actives-inventory.component.html',
  styles: [
  ]
})


export class AddValuationInActiveByActivesInventoryComponent implements OnInit {

  constructor(
    private valuationInActiveService: ValuationInActiveService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddValuationInActiveByActivesInventoryComponent>, private impactValuationService: ImpactValuationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  impactValuations: ImpactValuation[] = [];

  valuationInActive: ValuationInActive;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  activesInventoryId: string;

  ngOnInit(): void {
    this.initForm();
    this.getAllImpactValuations();
    this.activesInventoryId = this.data['activesInventoryId'];

    this.initValuationInActive();

  }

  initForm() {
    this.form = this._formBuilder.group({
      impactValuation: ['', [Validators.required,]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  initValuationInActive() {
    this.valuationInActive = new ValuationInActive();
  }



  getAllImpactValuations() {
    this.impactValuationService.getAll()
      .subscribe((res: any) => {
        this.impactValuations = res.data;
        this.initValuationInActive();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.valuationInActive.impactValuationId = this.form.value.impactValuation;
    this.valuationInActive.value = this.form.value.value;
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

    // let activesInventory = new ActivesInventory();
    // activesInventory._id = this.activesInventoryId;
    this.valuationInActive.activesInventoryId = Number(this.activesInventoryId);

    this.valuationInActiveService.insert(this.valuationInActive)
      .subscribe(res => {
        this.valuationInActive = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } 

  change(value){
    this.impactValuations.forEach(item =>{
      if (item.impactValuationId.toString() == value.toString()){
        this.form.patchValue({
          value: item.defaultValue
        })
      }
    });
  }
  
  close() {
    this.dialogRef.close();
  }


}

