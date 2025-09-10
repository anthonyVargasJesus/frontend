import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { ReferenceDocumentationService } from 'app/services/reference-documentation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { DialogData } from 'app/models/dialog-data';
import { LoginService } from 'app/services/login.service';
import { AddFileToFirebaseComponent } from '../../reference-documentation-in-storage/add-file-to-firebase/add-file-to-firebase.component';


@Component({
  selector: 'app-edit-reference-documentation',
  templateUrl: './edit-reference-documentation.component.html',
  styles: [
  ]
})


export class EditReferenceDocumentationComponent implements OnInit {

  constructor(
    private referenceDocumentationService: ReferenceDocumentationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditReferenceDocumentationComponent>,
    private _loginService: LoginService, private dialog: MatDialog,
  ) { }

  documentations: Documentation[] = [];

  referenceDocumentation: ReferenceDocumentation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR EVIDENCIA';

  evaluationId: string;
  requirementEvaluationId: string;
  standardId: number;

  panelClass: string;

  ngOnInit(): void {
    this.initForm();
    this.evaluationId = this.data['evaluationId'];
    this.requirementEvaluationId = this.data['requirementEvaluationId'];
    this.standardId = this.data['standardId'];
    this.panelClass = this.data['panelClass'];
    this.getAllDocumentations();

    this.initReferenceDocumentation();




  }

  initReferenceDocumentation() {
    this.referenceDocumentation = new ReferenceDocumentation();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      url: ['', [Validators.required, Validators.maxLength(500),]],
      description: ['', [Validators.maxLength(500),]],
      documentationId: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.referenceDocumentationService.obtain(id)
      .subscribe((res: any) => {
        this.referenceDocumentation = res.data;
        this.setFormValue(this.referenceDocumentation); 
        this.title = this.referenceDocumentation.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(referenceDocumentation: ReferenceDocumentation) {
    this.form.setValue({
      name: ((referenceDocumentation.name == null) ? '' : referenceDocumentation.name),
      url: ((referenceDocumentation.url == null) ? '' : referenceDocumentation.url),
      description: ((referenceDocumentation.description == null) ? '' : referenceDocumentation.description),
      documentationId: ((referenceDocumentation.documentationId == null) ? '' : referenceDocumentation.documentationId),
    });
  }

  getFormValue() {
    this.referenceDocumentation.referenceDocumentationId = Number(this.id);
    this.referenceDocumentation.name = this.form.value.name;
    this.referenceDocumentation.url = this.form.value.url;
    this.referenceDocumentation.description = this.form.value.description;
    if (this.form.value.description == "")
      this.referenceDocumentation.description = null;
    this.referenceDocumentation.documentationId = this.form.value.documentationId;
  }

  getAllDocumentations() {
    this.loading = true;
    this.documentationService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.documentations = res.data;
        this.initReferenceDocumentation();

        this.id = this.data['_id'];
        this.obtain(this.id);
        this.loading = false;
      }, error => {
        this.loading = false;
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



    this.referenceDocumentationService.update(this.referenceDocumentation)
      .subscribe(res => {
        this.referenceDocumentation = res.data;
        this.dialogRef.close({ updated: true });
        this.loading2 = false;


      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

    uploadImage() {
    
        if (this._loginService.isAuthenticated()) {
          let dialogRef = this.dialog.open(AddFileToFirebaseComponent, {
            height: '320px',
            width: '500px',
            autoFocus: false,
            data: {
              standardId: this.standardId,
              requirementEvaluationId: this.requirementEvaluationId,
            },
            panelClass: this.panelClass
          });
    
          dialogRef.afterClosed().subscribe(data => {
            if (data == null)
              return;
    
            if (data.updated == true) {
              this.form.patchValue({ url: data.url }, { emitEvent: true, onlySelf: false });
            }
    
    
          });
        }
    
      }

  close() {
    this.dialogRef.close();
  }


}
