import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { User } from 'app/models/user';
import { ErrorManager } from 'app/errors/error-manager';
import { UserService } from 'app/services/user.service';

import { UserStateService } from 'app/services/user-state.service';
import { UserState } from 'app/models/user-state';



@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styles: [
  ]
})


export class AddUserComponent implements OnInit {

  constructor(
    private userService: UserService,
    public router: Router,
    private _formBuilder: FormBuilder, private userStateService: UserStateService,


  ) { }

  userStates: UserState[] = [];

  user: User;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  public contentHeader: object;

  ngOnInit(): void {
    this.initForm(); this.initMenuName();
    this.getAllUserStates();

    this.initUser();

  } initMenuName() {
    this.contentHeader = {
      headerTitle: 'Product',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Product',
            isLink: false,
            link: '#'
          },
          {
            name: 'Product',
            isLink: false
          }
        ]
      }
    }
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      middleName: ['', [Validators.maxLength(200),]],
      firstName: ['', [Validators.required, Validators.maxLength(200),]],
      lastName: ['', [Validators.maxLength(200),]],
      email: ['', [Validators.required, Validators.maxLength(200),]],
      phone: ['', [Validators.maxLength(100),]],
      userState: ['', [Validators.required,]],
      documentNumber: ['', [Validators.required, Validators.maxLength(20),]],
    });
  }

  initUser() {
    this.user = new User();
  }



  getAllUserStates() {
    this.userStateService.getAll()
      .subscribe((res: any) => {
        this.userStates = res.data;
        this.initUser();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.user.name = this.form.value.name;
    this.user.middleName = this.form.value.middleName;
    this.user.firstName = this.form.value.firstName;
    this.user.lastName = this.form.value.lastName;
    this.user.email = this.form.value.email;
    this.user.phone = this.form.value.phone;
    this.user.userStateId = this.form.value.userState;
    this.user.documentNumber = this.form.value.documentNumber;
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

    this.userService.insert(this.user)
      .subscribe(res => {
        this.loading2 = false; 
        this.router.navigate(['/edit-user', res.data]);
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } navigateToBack() {
    this.router.navigate(['/user']);
  }
}

