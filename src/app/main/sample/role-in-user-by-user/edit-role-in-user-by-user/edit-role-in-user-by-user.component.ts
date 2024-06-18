import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleInUser } from 'app/models/role-in-user';
import { ErrorManager } from 'app/errors/error-manager';
import { RoleInUserService } from 'app/services/role-in-user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'app/services/role.service';
import { Role } from 'app/models/role';
import { DialogData } from 'app/models/dialog-data'; import { User } from 'app/models/user';

@Component({
  selector: 'app-edit-role-in-user-by-user',
  templateUrl: './edit-role-in-user-by-user.component.html',
  styles: [
  ]
})
export class EditRoleInUserByUserComponent implements OnInit {

  constructor(
    private roleInUserService: RoleInUserService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRoleInUserByUserComponent>,

  ) { }

  roles: Role[] = [];
  userId: string;

  roleInUser: RoleInUser;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();

    this.userId = this.data['userId']; this.getAllRoles();

    this.initRoleInUser();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initRoleInUser() {
    this.roleInUser = new RoleInUser();
    this.initRole();
  }
  initRole() {
    if (this.roles.length > 0)
      this.roleInUser.role = this.roles[0];
  }

  initForm() {
    this.form = this._formBuilder.group({
      role: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.roleInUserService.obtain(id)
      .subscribe((res: any) => {
        this.roleInUser = res.data;
        this.setFormValue(this.roleInUser);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(roleInUser: RoleInUser) {
    this.form.setValue({
      role: ((roleInUser.roleId == null) ? '' : roleInUser.roleId),
    });
  }


  getFormValue() {
    this.roleInUser.roleInUserId = Number(this.id);
    this.roleInUser.roleId = this.form.value.role;
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.roleInUserService.update(this.roleInUser)
      .subscribe(res => {
        this.roleInUser = res.data;
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

