import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { ReferenceDocumentationService } from 'app/services/reference-documentation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { DialogData } from 'app/models/dialog-data';
import { ReferenceDocumentationInStorageService } from 'app/services/reference-documentation-in-storage.service';
import { AddFileToFirebaseComponent } from '../add-file-to-firebase/add-file-to-firebase.component';
import { LoginService } from 'app/services/login.service';
import { getReferenceDocsKey } from 'app/config/config';


@Component({
  selector: 'app-add-reference-documentation-in-storage',
  templateUrl: './add-reference-documentation-in-storage.component.html',
  styles: [
  ]
})


export class AddReferenceDocumentationInStorageComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddReferenceDocumentationInStorageComponent>, private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private _loginService: LoginService, private dialog: MatDialog

  ) { }

  documentations: Documentation[] = [];
  referenceDocumentation: ReferenceDocumentation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: number;
  requirementEvaluationId: number;
  referenceDocumentationId: number;
  controlEvaluationId: number;
  panelClass: string;

  ngOnInit(): void {
    this.referenceDocumentationId = Date.now();
    this.initForm();
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
    this.referenceDocumentation.referenceDocumentationId = Date.now();
    this.referenceDocumentation.name = this.form.value.name;
    this.referenceDocumentation.url = this.form.value.url;
    this.referenceDocumentation.description = this.form.value.description;
    if (this.form.value.description == "")
      this.referenceDocumentation.description = null;
    this.referenceDocumentation.documentationId = this.form.value.documentationId;
    this.referenceDocumentation.documentation = this.documentations.find(doc => doc.documentationId == this.form.value.documentationId);
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



  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.referenceDocumentation.requirementEvaluationId = Number(this.requirementEvaluationId);
    this.referenceDocumentation.controlEvaluationId = Number(this.controlEvaluationId);

    this.saveReferenceDoc(this.referenceDocumentation);
    this.dialogRef.close({ updated: true });

  }

  saveReferenceDoc(doc: ReferenceDocumentation): void {

    let LS_KEY = getReferenceDocsKey(this.controlEvaluationId, this.requirementEvaluationId);

    // 1 · Lee lo que ya exista
    const stored = localStorage.getItem(LS_KEY);
    const list: ReferenceDocumentation[] = stored ? JSON.parse(stored) : [];

    // 2 · (‑opcional‑) genera un id incremental si viene vacío
    if (!doc.referenceDocumentationId) {
      const lastId = list.length ? list[list.length - 1].referenceDocumentationId ?? 0 : 0;
      doc.referenceDocumentationId = (lastId as number) + 1;
    }

    // 3 · Agrega el nuevo objeto
    list.push(doc);

    // 4 · Vuelve a guardar el array completo
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  close() {
    this.dialogRef.close();
  }

}
