import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SupportForControl } from 'app/models/support-for-control';
import { ErrorManager } from 'app/errors/error-manager';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlService } from 'app/services/control.service';
import { Control } from 'app/models/control';
import { DialogData } from 'app/models/dialog-data';
import { SupportForControlService } from 'app/services/support-for-control.service';


@Component({
  selector: 'app-edit-support-for-control',
  templateUrl: './edit-support-for-control.component.html',
  styles: [
  ]
})
export class EditSupportForControlComponent implements OnInit {

  constructor(
    private supportForControlService: SupportForControlService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private controlService: ControlService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditSupportForControlComponent>,

  ) { }

  controls: Control[] = [];

  supportForControl: SupportForControl;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = '';

  standardId: number;

  ngOnInit(): void {
    this.id = this.data['_id'];
    this.standardId = this.data['standardId'];
    this.initForm();
    this.getAllControls();
    this.initSupportForControl();


  }


  initSupportForControl() {
    this.supportForControl = new SupportForControl();
  }

  initForm() {
    this.form = this._formBuilder.group({
      control: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.supportForControlService.obtain(id)
      .subscribe((res: any) => {
        this.supportForControl = res.data;

        this.title = this.getTitle(this.supportForControl.controlId);

        this.setFormValue(this.supportForControl);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(supportForControl: SupportForControl) {
    this.form.setValue({
      control: ((supportForControl.controlId == null) ? '' : supportForControl.controlId),
    });
  }

  getTitle(controlId: number) {
    let name = '';
    this.controls.forEach(item => {
    
      if (item.controlId == controlId)
        name = item.name;
    });
    return name;
  }

  getFormValue() {
    if (this.form.value.control)
      this.supportForControl.controlId = this.form.value.control;
  }


  getAllControls() {
    this.controlService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.controls = res.data;
        this.obtain(this.id);
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

    this.supportForControlService.update(this.supportForControl)
      .subscribe(res => {
        this.supportForControl = res.data;
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
