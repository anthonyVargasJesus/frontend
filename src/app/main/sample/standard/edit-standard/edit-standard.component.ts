import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { Standard } from 'app/models/standard';
import { StandardService } from 'app/services/standard.service';

@Component({
  selector: 'app-edit-standard',
  templateUrl: './edit-standard.component.html',
  styles: [
  ]
})
export class EditStandardComponent implements OnInit {


  constructor(
    private standardService: StandardService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router,

  ) { }

  standards: Standard[] = [];

  standard: Standard = new Standard();
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';
  public contentHeader: object;


  ngOnInit(): void {
    this.initForm();
    this.initMenuName();
    this.initStandard();
    this.getAllStandards();





   
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Normas',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Configuración',
            isLink: false,
            link: '#'
          },
          {
            name: 'Normas',
            isLink: false
          }
        ]
      }
    }
  }

  initStandard() {
    this.standard = new Standard();
  }



  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      parentId: [0, []],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.standardService.obtain(id)
      .subscribe((res: any) => {
        this.standard = res.data;
        console.log(res);
        this.setFormValue(this.standard);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(standard: Standard) {
    this.form.setValue({
      name: ((standard.name == null) ? '' : standard.name),
      description: ((standard.description == null) ? '' : standard.description),
      parentId: ((standard.parentId == null) ? 0 : standard.parentId),
    });
  }


  getFormValue() {
    this.standard.name = this.form.value.name;
    this.standard.description = this.form.value.description;
    this.standard.parentId = this.form.value.parentId;
  }

  getAllStandards() {
    this.standardService.getAll()
      .subscribe((res: any) => {
        this.standards = res.data;
        this.initStandard();
        this.route.paramMap.subscribe((params: ParamMap) => {
          this.id = params.get('id').toString();
          this.obtain(this.id);
        });
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

    this.standardService.update(this.standard)
      .subscribe(res => {
        this.standard = res.data;
        this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  navigateToBack() {
    this.router.navigate(['/standard']);
  }

}
