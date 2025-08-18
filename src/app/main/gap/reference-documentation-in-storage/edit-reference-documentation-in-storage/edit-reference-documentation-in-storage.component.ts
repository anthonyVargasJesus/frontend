import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DocumentationService } from 'app/services/documentation.service';
import { Documentation } from 'app/models/documentation';
import { DialogData } from 'app/models/dialog-data';
import { AddFileToFirebaseComponent } from '../add-file-to-firebase/add-file-to-firebase.component';
import { LoginService } from 'app/services/login.service';


@Component({
  selector: 'app-edit-reference-documentation-in-storage',
  templateUrl: './edit-reference-documentation-in-storage.component.html',
  styles: [
  ]
})


export class EditReferenceDocumentationInStorageComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<EditReferenceDocumentationInStorageComponent>, private documentationService: DocumentationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private _loginService: LoginService, private dialog: MatDialog

  ) { }

  documentations: Documentation[] = [];
  referenceDocumentation: ReferenceDocumentation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: number;
  referenceDocumentationId: number;
  panelClass: string;

  ngOnInit(): void {
    this.referenceDocumentationId = this.data['referenceDocumentationId'];
    console.log('referenceDocumentation', this.referenceDocumentationId);
    this.initForm();
    this.standardId = this.data['standardId'];
    this.panelClass = this.data['panelClass'];
    this.getAllDocumentations();

    this.referenceDocumentation = this.obtain();
    this.setFormValue(this.referenceDocumentation);
  }

  obtain(): ReferenceDocumentation | undefined {
    const LS_KEY = 'referenceDocs';

    // Obtener el array del localStorage
    const stored = localStorage.getItem(LS_KEY);
    const references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];




    // Buscar y devolver el objeto con el ID indicado
    return references.find(ref => ref.referenceDocumentationId == this.referenceDocumentationId);
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      url: ['', [Validators.required, Validators.maxLength(500),]],
      description: ['', [Validators.maxLength(500),]],
      documentationId: ['', [Validators.required,]],
    });
  }

  getAllDocumentations() {
    this.documentationService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.documentations = res.data;

      }, error => {
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
    this.referenceDocumentation.referenceDocumentationId = this.referenceDocumentationId;
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

    this.updateReferenceDocumentation(this.referenceDocumentation);
    this.dialogRef.close({ updated: true });

  }

  updateReferenceDocumentation(updatedDoc: ReferenceDocumentation) {
    const LS_KEY = 'referenceDocs';

    // 1. Obtener el array actual
    const stored = localStorage.getItem(LS_KEY);
    const references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];

    console.log('references', references);

    // 2. Buscar el índice del objeto a actualizar
    const index = references.findIndex(ref => ref.referenceDocumentationId == updatedDoc.referenceDocumentationId);

    if (index !== -1) {
      // 3. Reemplazar el objeto con el nuevo
      references[index] = updatedDoc;

      // 4. Guardar el array actualizado en el localStorage
      localStorage.setItem(LS_KEY, JSON.stringify(references));
    } else {
      console.warn('Documento no encontrado en localStorage para actualizar.');
    }
  }


  close() {
    this.dialogRef.close();
  }

}
