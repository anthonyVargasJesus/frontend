import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Company } from 'app/models/company';
import { ErrorManager } from 'app/errors/error-manager';
import { CompanyService } from 'app/services/company.service';
import { LoginService } from 'app/services/login.service';


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styles: [
  ]
})
export class EditCompanyComponent implements OnInit {

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router,
    private _loginService: LoginService
  ) { }


  company: Company;
  loading = false;
  id: string;
  loading2 = false; public contentHeader: object; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    let currentUser = this._loginService.getCurrentUser();
    this.id = currentUser.companyId.toString();
    this.initForm();
    this.initMenuName();
    this.initCompany();
    this.obtain(this.id);
  }


  initCompany() {
    this.company = new Company();
  }






  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      abbreviation: ['', [Validators.maxLength(50),]],
      slogan: ['', [Validators.maxLength(500),]],
      logo: ['', [Validators.maxLength(500),]],
      address: ['', [Validators.maxLength(250),]],
      phone: ['', [Validators.maxLength(100),]],
    });
  } 
  
  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Datos de la empresa',
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
            name: 'Datos de la empresa',
            isLink: false
          }
        ]
      }
    }
  }

  obtain(id: string) {
    this.loading = true;
    this.companyService.obtain(id)
      .subscribe((res: any) => {
        this.company = res.data;
        this.setFormValue(this.company);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(company: Company) {
    this.form.setValue({
      name: ((company.name == null) ? '' : company.name),
      abbreviation: ((company.abbreviation == null) ? '' : company.abbreviation),
      slogan: ((company.slogan == null) ? '' : company.slogan),
      logo: ((company.logo == null) ? '' : company.logo),
      address: ((company.address == null) ? '' : company.address),
      phone: ((company.phone == null) ? '' : company.phone),
    });
  }


  getFormValue() {
    this.company.companyId = Number(this.id);
    this.company.name = this.form.value.name;
    this.company.abbreviation = this.form.value.abbreviation;
    this.company.slogan = this.form.value.slogan;
    this.company.logo = this.form.value.logo;
    this.company.address = this.form.value.address;
    this.company.phone = this.form.value.phone;
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

  this.company.companyId = Number(this.id);

    this.companyService.update(this.company)
      .subscribe(res => {
        this.company = res.data; this.loading2 = false;


      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

}

