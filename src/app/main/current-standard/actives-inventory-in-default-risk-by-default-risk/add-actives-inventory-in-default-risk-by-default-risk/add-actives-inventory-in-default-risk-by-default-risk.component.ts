import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ActivesInventoryInDefaultRisk } from 'app/models/actives-inventory-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ActivesInventoryInDefaultRiskService } from 'app/services/actives-inventory-in-default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivesInventoryService } from 'app/services/actives-inventory.service';
import { ActivesInventory } from 'app/models/actives-inventory';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-actives-inventory-in-default-risk-by-default-risk',
  templateUrl: './add-actives-inventory-in-default-risk-by-default-risk.component.html',
  styles: [
  ]
})


export class AddActivesInventoryInDefaultRiskByDefaultRiskComponent implements OnInit {

  constructor(
    private activesInventoryInDefaultRiskService: ActivesInventoryInDefaultRiskService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddActivesInventoryInDefaultRiskByDefaultRiskComponent>,
    private activesInventoryService: ActivesInventoryService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  activesInventories: ActivesInventory[] = [];

  activesInventoryInDefaultRisk: ActivesInventoryInDefaultRisk;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  defaultRiskId: number;

  ngOnInit(): void {
    this.defaultRiskId = this.data['defaultRiskId'];
    this.initForm();
    this.initActivesInventoryInDefaultRisk();
    this.getAllActivesInventories();
  }

  initForm() {
    this.form = this._formBuilder.group({
      activesInventoryId: ['', [Validators.required,]],
      isActive: [false, [Validators.maxLength(5),]],
    });
  }

  initActivesInventoryInDefaultRisk() {
    this.activesInventoryInDefaultRisk = new ActivesInventoryInDefaultRisk();
  }

  getAllActivesInventories() {
    this.loading = true;
    this.activesInventoryService.getAll()
      .subscribe((res: any) => {
        this.activesInventories = res.data;
         this.loading = false;
      }, error => {
          this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.activesInventoryInDefaultRisk.activesInventoryId = this.form.value.activesInventoryId;
    this.activesInventoryInDefaultRisk.isActive = this.form.value.isActive;
    if (this.form.value.isActive == "")
      this.activesInventoryInDefaultRisk.isActive = null;
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

    this.activesInventoryInDefaultRisk.defaultRiskId = this.defaultRiskId;

    this.activesInventoryInDefaultRiskService.insert(this.activesInventoryInDefaultRisk)
      .subscribe(res => {
        this.activesInventoryInDefaultRisk = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } close() {
    this.dialogRef.close();
  }
}

