import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Subprocess } from 'app/models/subprocess';
import { ErrorManager } from 'app/errors/error-manager';
import { SubprocessService } from 'app/services/subprocess.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MacroprocessService } from 'app/services/macroprocess.service';
import { Macroprocess } from 'app/models/macroprocess';



@Component({
  selector: 'app-add-subprocess',
  templateUrl: './add-subprocess.component.html',
  styles: [
  ]
})


export class AddSubprocessComponent implements OnInit {

  constructor(
    private subprocessService: SubprocessService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddSubprocessComponent>, private macroprocessService: MacroprocessService,


  ) { }

  macroprocesss: Macroprocess[] = [];

  subprocess: Subprocess;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();
    this.getAllMacroprocesss();

    this.initSubprocess();

  }

  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      macroprocess: ['', [Validators.required,]],
    });
  }

  initSubprocess() {
    this.subprocess = new Subprocess();
  }


  getAllMacroprocesss() {
    this.macroprocessService.getAll()
      .subscribe((res: any) => {
        this.macroprocesss = res.data;
        this.initSubprocess();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.subprocess.code = this.form.value.code;
    this.subprocess.name = this.form.value.name;
    this.subprocess.macroprocessId = this.form.value.macroprocess;
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



    this.subprocessService.insert(this.subprocess)
      .subscribe(res => {
        this.subprocess = res.data;
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
