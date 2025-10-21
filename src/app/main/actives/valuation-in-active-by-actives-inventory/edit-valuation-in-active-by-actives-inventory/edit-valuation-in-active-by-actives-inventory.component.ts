import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValuationInActive } from 'app/models/valuation-in-active';
import { ErrorManager } from 'app/errors/error-manager';
import { ValuationInActiveService } from 'app/services/valuation-in-active.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImpactValuationService } from 'app/services/impact-valuation.service';
import { ImpactValuation } from 'app/models/impact-valuation';
import { DialogData } from 'app/models/dialog-data';
import { ActivesInventory } from 'app/models/actives-inventory';

@Component({
  selector: 'app-edit-valuation-in-active-by-actives-inventory',
  templateUrl: './edit-valuation-in-active-by-actives-inventory.component.html',
  styles: [
  ]
})
export class EditValuationInActiveByActivesInventoryComponent implements OnInit {

  constructor(
    private valuationInActiveService: ValuationInActiveService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private impactValuationService: ImpactValuationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditValuationInActiveByActivesInventoryComponent>,

  ) { }

  impactValuations: ImpactValuation[] = [];
  activesInventoryId: string;

  valuationInActive: ValuationInActive;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();

    this.activesInventoryId = this.data['activesInventoryId']; 
    this.getAllImpactValuations();

    this.initValuationInActive();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initValuationInActive() {
    this.valuationInActive = new ValuationInActive();
    this.initImpactValuation();
  }
  initImpactValuation() {
    if (this.impactValuations.length > 0)
      this.valuationInActive.impactValuation = this.impactValuations[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      impactValuation: ['', [Validators.required,]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.valuationInActiveService.obtain(id)
      .subscribe((res: any) => {
        this.valuationInActive = res.data;
        this.setFormValue(this.valuationInActive);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(valuationInActive: ValuationInActive) {
    this.form.setValue({
      impactValuation: ((valuationInActive.impactValuationId == null) ? '' : valuationInActive.impactValuationId),
      value: ((valuationInActive.value == null) ? '' : valuationInActive.value),
    });
  }


  getFormValue() {
    this.valuationInActive.valuationInActiveId = Number(this.id);
    this.valuationInActive.impactValuationId = this.form.value.impactValuation;
    this.valuationInActive.value = this.form.value.value;
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.valuationInActiveService.update(this.valuationInActive)
      .subscribe(res => {
        this.valuationInActive = res.data;
        this.dialogRef.close({ updated: true });
        this.loading2 = false;


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

