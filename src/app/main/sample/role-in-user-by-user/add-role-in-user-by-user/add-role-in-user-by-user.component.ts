import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { RoleInUser } from 'app/models/role-in-user';
import { ErrorManager } from 'app/errors/error-manager';
import { RoleInUserService } from 'app/services/role-in-user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'app/services/role.service';
import { Role } from 'app/models/role';

import { User } from 'app/models/user';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-role-in-user-by-user',
  templateUrl: './add-role-in-user-by-user.component.html',
  styles: [
  ]
})


export class AddRoleInUserByUserComponent implements OnInit {

  constructor(
    private roleInUserService: RoleInUserService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRoleInUserByUserComponent>, private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  roles: Role[] = [];

  roleInUser: RoleInUser;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  userId: string;

  ngOnInit(): void {
    this.initForm();
    this.getAllRoles();
    this.userId = this.data['userId'];

    this.initRoleInUser();

  }

  initForm() {
    this.form = this._formBuilder.group({
      role: ['', [Validators.required,]],
    });
  }

  initRoleInUser() {
    this.roleInUser = new RoleInUser();
  }



  getAllRoles() {
    this.roleService.getAll()
      .subscribe((res: any) => {
        this.roles = res.data;
        this.initRoleInUser();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.roleInUser.roleId = this.form.value.role;
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

    this.roleInUser.userId = Number(this.userId);

    this.roleInUserService.insert(this.roleInUser)
      .subscribe(res => {
        this.roleInUser = res.data;
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

