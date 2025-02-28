import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Scope } from 'app/models/scope';
import { ErrorManager } from 'app/errors/error-manager';
import { ScopeService } from 'app/services/scope.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-scope-by-standard',
  templateUrl: './add-scope-by-standard.component.html',
  styles: [
  ]
})


export class AddScopeByStandardComponent implements OnInit {

  constructor(
    private scopeService: ScopeService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddScopeByStandardComponent>, @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }


  scope: Scope;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: string;

  ngOnInit(): void {
    this.initForm();
    this.standardId = this.data['standardId'];

    this.initScope();

  }

  initForm() {
    this.form = this._formBuilder.group({
      isCurrent: [false, [Validators.required, Validators.maxLength(5),]],
      date: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  initScope() {
    this.scope = new Scope();
  }




  getFormValue() {
    this.scope.isCurrent = this.form.value.isCurrent;
    this.scope.date = this.form.value.date;
    this.scope.name = this.form.value.name;
    this.scope.description = this.form.value.description;
    if (this.form.value.description == "")
      this.scope.description = null;
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


    this.scope.standardId = Number(this.standardId);

    this.scopeService.insert(this.scope)
      .subscribe(res => {
        this.scope = res.data;
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

