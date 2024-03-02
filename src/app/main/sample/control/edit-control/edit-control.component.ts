import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';    
import Swal from 'sweetalert2';
import { Control } from 'app/models/control';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlService } from 'app/services/control.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlGroupService } from 'app/services/control-group.service';
import { ControlGroup } from 'app/models/control-group';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-control',
  templateUrl: './edit-control.component.html',
  styles: [
  ]
})

export class EditControlComponent implements OnInit {

  constructor(
    private controlService: ControlService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private controlGroupService: ControlGroupService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditControlComponent>,

  ) { }

  controlGroups: ControlGroup[] = [];

  control: Control;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();

    this.getAllControlGroups();

    this.initControl();

    this.id = this.data['_id'];
    this.obtain(this.id);
  }

  initControl() {
    this.control = new Control();
    this.control.name = "EDITAR CONTROL";
    this.initControlGroup();
  }

  initControlGroup() {
    if (this.controlGroups.length > 0) {
      let controlGroup = new ControlGroup();
      controlGroup.controlGroupId = this.controlGroups[0].controlGroupId;
    }
  }

  initForm() {
    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      controlGroup: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.controlService.obtain(id)
      .subscribe((res: any) => {
        this.control = res.data;
        this.setFormValue(this.control);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(control: Control) {
    this.form.setValue({
      number: ((control.number == null) ? '' : control.number),
      name: ((control.name == null) ? '' : control.name),
      description: ((control.description == null) ? '' : control.description),
      controlGroup: ((control.controlGroupId == null) ? '' : control.controlGroupId),
    });
  }


  getFormValue() {
    this.control.number = this.form.value.number;
    this.control.name = this.form.value.name;
    this.control.description = this.form.value.description;
    if (this.form.value.controlGroup)
      this.control.controlGroupId = this.form.value.controlGroup;
  }

  getAllControlGroups() {
    this.controlGroupService.getAll()
      .subscribe((res: any) => {
        this.controlGroups = res.data;
        this.initControl();
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

    this.controlService.update(this.control)
      .subscribe(res => {
        this.control = res.data;
        this.dialogRef.close({ updated: true }); this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

  // constructor(
  //   private _formBuilder: FormBuilder,
  //   private dialogRef: MatDialogRef<EditControlComponent>,


  // ) { }


  // loading = false;
  // loading2 = false;
  // public form: FormGroup;
  // public submitted = false;
  // public form2: FormGroup;

  // ngOnInit(): void {
  //   this.initForm();
  // }

  // initForm() {
  //   this.form = this._formBuilder.group({
  //     numeration: ['1', [Validators.required, Validators.maxLength(10),]],
  //     name: ['Políticas de seguridad de la información', [Validators.required, Validators.maxLength(100),]],
  //     description: ['', [Validators.maxLength(500),]],
  //     requirement: ['1'],
  //   });

  //   this.form2 = this._formBuilder.group({
  //     controlTypes: [['1'], []],
  //     dimensions: [['1','2','3'], []],
  //     concepts: [['1'], []],
  //     capabilities: [['1','2'], []],
  //     domains: [['1'], []],
  //   });

  // }


  // get f() {
  //   return this.form.controls;
  // }

  // save() {


  // }

  // close() {
  //   this.dialogRef.close();
  // }

}
