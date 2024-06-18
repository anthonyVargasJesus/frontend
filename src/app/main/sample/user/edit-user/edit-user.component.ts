import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from 'app/models/user';
import { ErrorManager } from 'app/errors/error-manager';
import { UserService } from 'app/services/user.service';
import { UserStateService } from 'app/services/user-state.service';
import { UserState } from 'app/models/user-state';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styles: [
  ]
})
export class EditUserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private userStateService: UserStateService,


  ) { }

  userStates: UserState[] = [];

  user: User = new User();
  loading = false;
  id: string;
  loading2 = false; public contentHeader: object; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initMenuName(); 
    this.getAllUserStates();
    this.initUser();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      this.obtain(this.id);
    });


  }


  initUser() {
    this.user = new User();
    this.initUserState();
  }






  initUserState() {
    if (this.userStates.length > 0)
      this.user.userState = this.userStates[0];
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
  } initMenuName() {
    this.contentHeader = {
      headerTitle: 'Usuarios',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONFIGURACIÓN',
            isLink: false,
            link: '#'
          },
          {
            name: 'Usuarios',
            isLink: false
          }
        ]
      }
    }
  }

  obtain(id: string) {
    this.loading = true;
    this.userService.obtain(id)
      .subscribe((res: any) => {
        this.user = res.data;
        console.log(res);
        this.setFormValue(this.user);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(user: User) {
    this.form.setValue({
      name: ((user.name == null) ? '' : user.name),
      middleName: ((user.middleName == null) ? '' : user.middleName),
      firstName: ((user.firstName == null) ? '' : user.firstName),
      lastName: ((user.lastName == null) ? '' : user.lastName),
      email: ((user.email == null) ? '' : user.email),
      phone: ((user.phone == null) ? '' : user.phone),
      userState: ((user.userStateId == null) ? '' : user.userStateId),
      documentNumber: ((user.documentNumber == null) ? '' : user.documentNumber),
    });
  }


  getFormValue() {
    this.user.userId = Number(this.id);
    this.user.name = this.form.value.name;
    this.user.middleName = this.form.value.middleName;
    this.user.firstName = this.form.value.firstName;
    this.user.lastName = this.form.value.lastName;
    this.user.email = this.form.value.email;
    this.user.phone = this.form.value.phone;
    this.user.userStateId = this.form.value.userState;
    this.user.documentNumber = this.form.value.documentNumber;
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();



    this.userService.update(this.user)
      .subscribe(res => {
        this.user = res.data; this.loading2 = false;


      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }
  navigateToBack() {
    this.router.navigate(['/user']);
  }
}

