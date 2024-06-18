import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Role } from 'app/models/role';
import { ErrorManager } from 'app/errors/error-manager';
import { RoleService } from 'app/services/role.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styles: [
  ]
})
export class EditRoleComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditRoleComponent>,

  ) { }


  role: Role;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initRole();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initRole() {
    this.role = new Role();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.roleService.obtain(id)
      .subscribe((res: any) => {
        this.role = res.data;
        this.setFormValue(this.role);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(role: Role) {
    this.form.setValue({
      name: ((role.name == null) ? '' : role.name),
    });
  }


  getFormValue() {
    this.role.roleId = Number(this.id);
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



    this.roleService.update(this.role)
      .subscribe(res => {
        this.role = res.data;
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

