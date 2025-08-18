import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Control } from 'app/models/control';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlService } from 'app/services/control.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlGroupService } from 'app/services/control-group.service';
import { ControlGroup } from 'app/models/control-group';
import { StandardService } from 'app/services/standard.service';
import { DialogData } from 'app/models/dialog-data';



@Component({
  selector: 'app-add-control',
  templateUrl: './add-control.component.html',
  styles: [
  ]
})

export class AddControlComponent implements OnInit {

  constructor(
    private controlService: ControlService,
    public router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddControlComponent>,
    private controlGroupService: ControlGroupService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  controlGroups: ControlGroup[] = [];

  control: Control;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  controlGroupId: string; 
  standardId: string;

  ngOnInit(): void {
    this.controlGroupId = this.data['controlGroupId'];
    this.standardId = this.data['standardId'];
    this.getAllControlGroups();
    this.initForm();
    this.initControl();
  }

  initForm() {

    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      controlGroup: [Number(this.controlGroupId), [Validators.required,]],
    });
  }

  initControl() {
    this.control = new Control();
    this.initControlGroup();
  }



  initControlGroup() {
    if (this.controlGroups.length > 0) {
      let controlGroup = new ControlGroup();
      controlGroup.controlGroupId = this.controlGroups[0].controlGroupId;
    }
  }


  setNullValues() {


  }


  getAllControlGroups() {
    this.controlGroupService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.controlGroups = res.data;

        this.initControl();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.control.number = this.form.value.number;
    this.control.name = this.form.value.name;
    this.control.description = this.form.value.description;
    if (this.form.value.controlGroup)
      this.control.controlGroupId = this.form.value.controlGroup;
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
    this.control.standardId = Number(this.standardId);
    this.control.controlGroupId = Number(this.controlGroupId);

    this.controlService.insert(this.control)
      .subscribe(res => {
        this.control = res.data;
        this.setNullValues();
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

