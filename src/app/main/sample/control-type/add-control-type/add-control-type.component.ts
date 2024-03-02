import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlGroup } from 'app/models/control-group';
import { DialogData } from 'app/models/dialog-data';
import { ControlGroupService } from 'app/services/control-group.service';
import { StandardService } from 'app/services/standard.service';

@Component({
  selector: 'app-add-control-type',
  templateUrl: './add-control-type.component.html',
  styles: [
  ]
})
export class AddControlTypeComponent implements OnInit {

  constructor(
    private controlGroupService: ControlGroupService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddControlTypeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }


  controlGroup: ControlGroup;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: string;

  ngOnInit(): void {
    this.initForm(); 
    this.standardId = this.data['standardId'];
    this.initControlGroup();

  }

  initForm() {
    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initControlGroup() {
    this.controlGroup = new ControlGroup();
  }

  getFormValue() {
    this.controlGroup.number = this.form.value.number;
    this.controlGroup.name = this.form.value.name;
    this.controlGroup.description = this.form.value.description;
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

    this.controlGroup.standardId = Number(this.standardId);

    this.controlGroupService.insert(this.controlGroup)
      .subscribe(res => {
        this.controlGroup = res.data;
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

