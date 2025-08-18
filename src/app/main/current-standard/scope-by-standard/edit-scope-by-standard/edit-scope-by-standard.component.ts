import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Scope } from 'app/models/scope';
import { ErrorManager } from 'app/errors/error-manager';
import { ScopeService } from 'app/services/scope.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data'; 
import { Standard } from 'app/models/standard';

@Component({
  selector: 'app-edit-scope-by-standard',
  templateUrl: './edit-scope-by-standard.component.html',
  styles: [
  ]
})
export class EditScopeByStandardComponent implements OnInit {

  constructor(
    private scopeService: ScopeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditScopeByStandardComponent>,

  ) { }


  scope: Scope;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR SCOPE';;

  ngOnInit(): void {
    this.initForm();
    this.initScope();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initScope() {
    this.scope = new Scope();
  }




  initForm() {
    this.form = this._formBuilder.group({
      isCurrent: [false, [Validators.required, Validators.maxLength(5),]],
      date: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.scopeService.obtain(id)
      .subscribe((res: any) => {
        this.scope = res.data;
        this.setFormValue(this.scope); this.title = this.scope.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(scope: Scope) {
    this.form.setValue({
      isCurrent: ((scope.isCurrent == null) ? '' : scope.isCurrent),
      date: ((scope.date == null) ? '' : scope.date),
      name: ((scope.name == null) ? '' : scope.name),
      description: ((scope.description == null) ? '' : scope.description),
    });
  }


  getFormValue() {
    this.scope.scopeId = Number(this.id);
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

    this.scopeService.update(this.scope)
      .subscribe(res => {
        this.scope = res.data;
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

