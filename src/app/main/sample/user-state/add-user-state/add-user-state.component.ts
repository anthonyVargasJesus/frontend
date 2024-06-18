import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { UserState } from 'app/models/user-state';
import { ErrorManager } from 'app/errors/error-manager';
import { UserStateService } from 'app/services/user-state.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-user-state',
  templateUrl: './add-user-state.component.html',
  styles: [
  ]
})


export class AddUserStateComponent implements OnInit {

  constructor(
    private userStateService: UserStateService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddUserStateComponent>,

  ) { }


  userState: UserState;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initUserState();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  initUserState() {
    this.userState = new UserState();
  }




  getFormValue() {
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



    this.userStateService.insert(this.userState)
      .subscribe(res => {
        this.userState = res.data;
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

