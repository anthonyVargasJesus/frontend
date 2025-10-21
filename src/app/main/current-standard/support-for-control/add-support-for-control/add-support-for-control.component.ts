import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SupportForControl } from 'app/models/support-for-control';
import { ErrorManager } from 'app/errors/error-manager';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlService } from 'app/services/control.service';
import { Control } from 'app/models/control';
import { DialogData } from 'app/models/dialog-data';
import { SupportForControlService } from 'app/services/support-for-control.service';


@Component({
  selector: 'app-add-support-for-control',
  templateUrl: './add-support-for-control.component.html',
  styles: [
  ]
})
export class AddSupportForControlComponent implements OnInit {

  constructor(
    private supportForControlService: SupportForControlService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddSupportForControlComponent>,
    private controlService: ControlService, @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  controls: Control[] = [];

  supportForControl: SupportForControl;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  standardId: number;
  documentationId: number;

  ngOnInit(): void {
    this.standardId = this.data['standardId'];
    this.documentationId = this.data['documentationId'];

    this.initForm();
    this.getAllControls();
    this.initSupportForControl();
  }

  initForm() {
    this.form = this._formBuilder.group({
      control: ['', [Validators.required,]],
    });
  }

  initSupportForControl() {
    this.supportForControl = new SupportForControl();
  }


  getAllControls() {
    this.controlService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.controls = res.data;
        this.initSupportForControl();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    if (this.form.value.control)
      this.supportForControl.controlId = this.form.value.control;
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

    this.supportForControl.standardId = this.standardId;
    this.supportForControl.documentationId = this.documentationId;

    this.supportForControlService.insert(this.supportForControl)
      .subscribe(res => {
        this.supportForControl = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}
