import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DocumentType } from 'app/models/document-type';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentTypeService } from 'app/services/document-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-document-type',
  templateUrl: './edit-document-type.component.html',
  styles: [
  ]
})
export class EditDocumentTypeComponent implements OnInit {

  constructor(
    private documentTypeService: DocumentTypeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router,

  ) { }

  public contentHeader: object;
  documentType: DocumentType;
  loading = false;
  id: string = '';
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initDocumentType();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      this.obtain(this.id);
    });
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

  initDocumentType() {
    this.documentType = new DocumentType();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.documentTypeService.obtain(id)
      .subscribe((res: any) => {
        this.documentType = res.data;
        this.setNullValues();
        this.setFormValue(this.documentType);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(documentType: DocumentType) {
    this.form.setValue({
      name: ((documentType.name == null) ? '' : documentType.name),
      description: ((documentType.description == null) ? '' : documentType.description),
    });
  }


  getFormValue() {
    this.documentType.name = this.form.value.name;
    this.documentType.description = this.form.value.description;
  }
  setNullValues() {
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

    this.documentTypeService.update(this.documentType)
      .subscribe(res => {
        this.documentType = res.data;
        this.setNullValues();
        this.loading2 = false;
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  navigateToBack() {
    this.router.navigate(['/document-type']);
  }

}
