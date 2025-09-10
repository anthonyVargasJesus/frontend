import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActivesInventoryInDefaultRisk } from 'app/models/actives-inventory-in-default-risk';
import { ErrorManager } from 'app/errors/error-manager';
import { ActivesInventoryInDefaultRiskService } from 'app/services/actives-inventory-in-default-risk.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivesInventoryService } from 'app/services/actives-inventory.service';
import { ActivesInventory } from 'app/models/actives-inventory';
import { DialogData } from 'app/models/dialog-data'; import { DefaultRisk } from 'app/models/default-risk';

@Component({
  selector: 'app-edit-actives-inventory-in-default-risk-by-default-risk',
  templateUrl: './edit-actives-inventory-in-default-risk-by-default-risk.component.html',
  styles: [
  ]
})

export class EditActivesInventoryInDefaultRiskByDefaultRiskComponent implements OnInit {

  constructor(
    private activesInventoryInDefaultRiskService: ActivesInventoryInDefaultRiskService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private activesInventoryService: ActivesInventoryService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditActivesInventoryInDefaultRiskByDefaultRiskComponent>,

  ) { }

  activesInventories: ActivesInventory[] = [];

  activesInventoryInDefaultRisk: ActivesInventoryInDefaultRisk;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR ACTIVO';

  ngOnInit(): void {
    this.initForm();
    this.initActivesInventoryInDefaultRisk();
    this.id = this.data['_id'];
    this.getAllActivesInventories();
  }


  initActivesInventoryInDefaultRisk() {
    this.activesInventoryInDefaultRisk = new ActivesInventoryInDefaultRisk();
    this.initActivesInventory();
  }
  initActivesInventory() {
    if (this.activesInventories.length > 0)
      this.activesInventoryInDefaultRisk.activesInventory = this.activesInventories[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      activesInventoryId: ['', [Validators.required,]],
      isActive: [false, [Validators.maxLength(5),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.activesInventoryInDefaultRiskService.obtain(id)
      .subscribe((res: any) => {
        this.activesInventoryInDefaultRisk = res.data;
        this.setFormValue(this.activesInventoryInDefaultRisk); 
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(activesInventoryInDefaultRisk: ActivesInventoryInDefaultRisk) {
    this.form.setValue({
      activesInventoryId: ((activesInventoryInDefaultRisk.activesInventoryId == null) ? '' : activesInventoryInDefaultRisk.activesInventoryId),
      isActive: ((activesInventoryInDefaultRisk.isActive == null) ? '' : activesInventoryInDefaultRisk.isActive),
    });
  }


  getFormValue() {
    this.activesInventoryInDefaultRisk.activesInventoryInDefaultRiskId = Number(this.id);
    this.activesInventoryInDefaultRisk.activesInventoryId = this.form.value.activesInventoryId;
    this.activesInventoryInDefaultRisk.isActive = this.form.value.isActive;
    if (this.form.value.isActive == "")
      this.activesInventoryInDefaultRisk.isActive = null;
  }

  getAllActivesInventories() {
    this.loading = true;
    this.activesInventoryService.getAll()
      .subscribe((res: any) => {
        this.activesInventories = res.data;
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

    this.activesInventoryInDefaultRiskService.update(this.activesInventoryInDefaultRisk)
      .subscribe(res => {
        this.activesInventoryInDefaultRisk = res.data;
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

