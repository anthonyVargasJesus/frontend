import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Macroprocess } from 'app/models/macroprocess';
import { ErrorManager } from 'app/errors/error-manager';
import { MacroprocessService } from 'app/services/macroprocess.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-macroprocess',
  templateUrl: './edit-macroprocess.component.html',
  styles: [
  ]
})
export class EditMacroprocessComponent implements OnInit {

  constructor(
    private macroprocessService: MacroprocessService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditMacroprocessComponent>,

  ) { }


  macroprocess: Macroprocess;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initMacroprocess();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initMacroprocess() {
    this.macroprocess = new Macroprocess();
  }


  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.macroprocessService.obtain(id)
      .subscribe((res: any) => {
        this.macroprocess = res.data;
        this.setNullValues();
        this.setFormValue(this.macroprocess);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(macroprocess: Macroprocess) {
    this.form.setValue({
      code: ((macroprocess.code == null) ? '' : macroprocess.code),
      name: ((macroprocess.name == null) ? '' : macroprocess.name),
    });
  }


  getFormValue() {
    this.macroprocess.macroprocessId = Number(this.id);
    this.macroprocess.code = this.form.value.code;
    this.macroprocess.name = this.form.value.name;
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

    this.macroprocessService.update(this.macroprocess)
      .subscribe(res => {
        this.macroprocess = res.data;
        this.setNullValues();
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

