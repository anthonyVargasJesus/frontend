import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Documentation } from 'app/models/documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentationService } from 'app/services/documentation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RequirementService } from 'app/services/requirement.service';
import { Requirement } from 'app/models/requirement';
import { DialogData } from 'app/models/dialog-data';
import { DocumentTypeService } from 'app/services/document-type.service';
import { LoginService } from 'app/services/login.service';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AddDocumentTypeComponent } from '../../document-type/add-document-type/add-document-type.component';


@Component({
  selector: 'app-add-documentation',
  templateUrl: './add-documentation.component.html',
  styles: [
  ]
})
export class AddDocumentationComponent implements OnInit {

  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  
  constructor(
    private documentationService: DocumentationService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddDocumentationComponent>,
    private requirementService: RequirementService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private documentTypeService: DocumentTypeService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) { }

  documentTypes: DocumentType[] = [];
  requirements: Requirement[] = [];

  documentation: Documentation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: string;

  ngOnInit(): void {
    this.getTheme();
    this.initForm();
    this.standardId = this.data['standardId'];
    this.getAllDocumentTypes();
    this.getAllRequirements();
    this.initDocumentation();
  }

  getTheme() {
    this._unsubscribeAll = new Subject();
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.currentSkin = config.layout.skin;
        this.setDialogContainerStyle();
      });
  }

  setDialogContainerStyle() {
    if (this.currentSkin == 'dark')
      this.panelClass = 'custom-dark-dialog-container';
    else
      this.panelClass = 'custom-default-dialog-container';
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      template: ['', [Validators.maxLength(250),]],
      documentType: ['', []],
    });
  }


  getAllDocumentTypes() {
    this.documentTypeService.getAll()
      .subscribe((res: any) => {
        this.documentTypes = res.data;
        this.initDocumentation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  initDocumentation() {
    this.documentation = new Documentation();
  }


  getAllRequirements() {
    this.requirementService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.requirements = res.data;
        this.initDocumentation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.documentation.name = this.form.value.name;
    this.documentation.description = this.form.value.description;
    this.documentation.template = this.form.value.template;
    this.documentation.documentTypeId = this.form.value.documentType;
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

    this.documentation.standardId = Number(this.standardId);

    this.documentationService.insert(this.documentation)
      .subscribe(res => {
        this.documentation = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

  addDocumentationType() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddDocumentTypeComponent, {
        height: '500px',
        width: '500px',
        autoFocus: false, panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.getAllDocumentTypes();
      });
    }

  }

}