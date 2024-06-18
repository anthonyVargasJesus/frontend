import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Role } from 'app/models/role';
import { ErrorManager } from 'app/errors/error-manager';
import { RoleService } from 'app/services/role.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styles: [
  ]
})


export class AddRoleComponent implements OnInit {

  constructor(
    private roleService: RoleService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRoleComponent>,

  ) { }


  role: Role;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initRole();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  initRole() {
    this.role = new Role();
  }




  getFormValue() {
    this.role.name = this.form.value.name;
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



    this.roleService.insert(this.role)
      .subscribe(res => {
        this.role = res.data;
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

