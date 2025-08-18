import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserState } from 'app/models/user-state';
import { ErrorManager } from 'app/errors/error-manager';
import { UserStateService } from 'app/services/user-state.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-user-state',
  templateUrl: './edit-user-state.component.html',
  styles: [
  ]
})
export class EditUserStateComponent implements OnInit {

  constructor(
    private userStateService: UserStateService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditUserStateComponent>,

  ) { }


  userState: UserState;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initUserState();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initUserState() {
    this.userState = new UserState();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.userStateService.obtain(id)
      .subscribe((res: any) => {
        this.userState = res.data;
        this.setFormValue(this.userState);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(userState: UserState) {
    this.form.setValue({
      name: ((userState.name == null) ? '' : userState.name),
      value: ((userState.value == null) ? '' : userState.value),
    });
  }


  getFormValue() {
    this.userState.userStateId = Number(this.id);
    this.userState.name = this.form.value.name;
    this.userState.value = this.form.value.value;
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



    this.userStateService.update(this.userState)
      .subscribe(res => {
        this.userState = res.data;
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

