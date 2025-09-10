import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-add-reference-documentation',
  templateUrl: './add-reference-documentation.component.html',
  styles: [
  ]
})


export class AddReferenceDocumentationComponent implements OnInit {

  constructor(
    private referenceDocumentationService: ReferenceDocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private _loginService: LoginService, private dialog: MatDialog,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddReferenceDocumentationComponent>, private documentationService: DocumentationService,

  ) { }

  documentations: Documentation[] = [];

  referenceDocumentation: ReferenceDocumentation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  evaluationId: string;
  requirementEvaluationId: string;
  controlEvaluationId: string;
  standardId: number;

  panelClass: string;

  ngOnInit(): void {
    this.initForm();
    this.evaluationId = this.data['evaluationId'];
    this.requirementEvaluationId = this.data['requirementEvaluationId'];
    this.controlEvaluationId = this.data['controlEvaluationId'];
    this.standardId = this.data['standardId'];
    this.panelClass = this.data['panelClass'];
    this.getAllDocumentations();
    this.initReferenceDocumentation();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      url: ['', [Validators.required, Validators.maxLength(500),]],
      description: ['', [Validators.maxLength(500),]],
      documentationId: ['', [Validators.required,]],
    });
  }

  initReferenceDocumentation() {
    this.referenceDocumentation = new ReferenceDocumentation();
  }



  getAllDocumentations() {
    this.documentationService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.documentations = res.data;
        this.initReferenceDocumentation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.referenceDocumentation.name = this.form.value.name;
    this.referenceDocumentation.url = this.form.value.url;
    this.referenceDocumentation.description = this.form.value.description;
    if (this.form.value.description == "")
      this.referenceDocumentation.description = null;
    this.referenceDocumentation.documentationId = this.form.value.documentationId;
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

    this.referenceDocumentation.evaluationId = Number(this.evaluationId);
    this.referenceDocumentation.requirementEvaluationId = Number(this.requirementEvaluationId);
    this.referenceDocumentation.controlEvaluationId = Number(this.controlEvaluationId);

    this.referenceDocumentationService.insert(this.referenceDocumentation)
      .subscribe(res => {
        this.referenceDocumentation = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
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
