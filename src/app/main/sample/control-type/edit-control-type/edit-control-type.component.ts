import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ControlType } from 'app/models/control-type';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlTypeService } from 'app/services/control-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-control-type',
  templateUrl: './edit-control-type.component.html',
  styles: [
  ]
})
export class EditControlTypeComponent implements OnInit {

  constructor(
    private controlTypeService: ControlTypeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditControlTypeComponent>,

  ) { }


  controlType: ControlType;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initControlType();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initControlType() {
    this.controlType = new ControlType();
  }







  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      factor: ['', [Validators.maxLength(8),]],
      minimum: ['', [Validators.required, Validators.maxLength(8),]],
      maximum: ['', [Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.controlTypeService.obtain(id)
      .subscribe((res: any) => {
        this.controlType = res.data;
        this.setFormValue(this.controlType);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(controlType: ControlType) {
    this.form.setValue({
      name: ((controlType.name == null) ? '' : controlType.name),
      description: ((controlType.description == null) ? '' : controlType.description),
      abbreviation: ((controlType.abbreviation == null) ? '' : controlType.abbreviation),
      factor: ((controlType.factor == null) ? '' : controlType.factor),
      minimum: ((controlType.minimum == null) ? '' : controlType.minimum),
      maximum: ((controlType.maximum == null) ? '' : controlType.maximum),
      color: ((controlType.color == null) ? '' : controlType.color),
    });
  }


  getFormValue() {
    this.controlType.controlTypeId = Number(this.id);
    this.controlType.name = this.form.value.name;
    this.controlType.description = this.form.value.description;
    this.controlType.abbreviation = this.form.value.abbreviation;
    this.controlType.factor = this.form.value.factor;
    this.controlType.minimum = this.form.value.minimum;
    this.controlType.maximum = this.form.value.maximum;
    this.controlType.color = this.form.value.color;

    if (this.form.value.minimum == "")
      this.controlType.minimum = null;
    if (this.form.value.maximum == "")
      this.controlType.maximum = null;
    if (this.form.value.factor == "")
      this.controlType.factor = null;
    
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



    this.controlTypeService.update(this.controlType)
      .subscribe(res => {
        this.controlType = res.data;
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
