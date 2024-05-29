import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Macroprocess } from 'app/models/macroprocess';
import { ErrorManager } from 'app/errors/error-manager';
import { MacroprocessService } from 'app/services/macroprocess.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-macroprocess',
  templateUrl: './add-macroprocess.component.html',
  styles: [
  ]
})


export class AddMacroprocessComponent implements OnInit {

  constructor(
    private macroprocessService: MacroprocessService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddMacroprocessComponent>,

  ) { }


  macroprocess: Macroprocess;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initMacroprocess();

  }

  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initMacroprocess() {
    this.macroprocess = new Macroprocess();
  }


  setNullValues() {
  }



  getFormValue() {
    this.macroprocess.code = this.form.value.code;
    this.macroprocess.name = this.form.value.name;
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



    this.macroprocessService.insert(this.macroprocess)
      .subscribe(res => {
        this.macroprocess = res.data;
        this.setNullValues();
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

