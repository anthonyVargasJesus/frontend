import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlGroup } from 'app/models/control-group';
import { DialogData } from 'app/models/dialog-data';
import { ControlGroupService } from 'app/services/control-group.service';

@Component({
  selector: 'app-edit-control-type',
  templateUrl: './edit-control-type.component.html',
  styles: [
  ]
})
export class EditControlTypeComponent implements OnInit {


  constructor(
    private controlGroupService: ControlGroupService,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditControlTypeComponent>,

  ) { }


  controlGroup: ControlGroup;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initControlGroup();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initControlGroup() {
    this.controlGroup = new ControlGroup();
  }



  initForm() {
    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.controlGroupService.obtain(id)
      .subscribe((res: any) => {
        this.controlGroup = res.data;
        this.setFormValue(this.controlGroup);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(controlGroup: ControlGroup) {
    this.form.setValue({
      number: ((controlGroup.number == null) ? '' : controlGroup.number),
      name: ((controlGroup.name == null) ? '' : controlGroup.name),
      description: ((controlGroup.description == null) ? '' : controlGroup.description),
    });
  }


  getFormValue() {
    this.controlGroup.number = this.form.value.number;
    this.controlGroup.name = this.form.value.name;
    this.controlGroup.description = this.form.value.description;
  }
  setNullValues() {
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

    this.controlGroupService.update(this.controlGroup)
      .subscribe(res => {
        this.controlGroup = res.data;
        this.setNullValues();
        this.dialogRef.close({ updated: true }); this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}
