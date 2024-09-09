import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Documentation } from 'app/models/documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentationService } from 'app/services/documentation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RequirementService } from 'app/services/requirement.service';
import { Requirement } from 'app/models/requirement';
import { DialogData } from 'app/models/dialog-data';
import { DocumentTypeService } from 'app/services/document-type.service';
import { Subject } from 'rxjs/internal/Subject';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AddDocumentTypeComponent } from '../../document-type/add-document-type/add-document-type.component';


@Component({
  selector: 'app-edit-documentation-manager',
  templateUrl: './edit-documentation-manager.component.html',
  styles: [
  ]
})
export class EditDocumentationManagerComponent implements OnInit {

  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  public contentHeader: object;


  constructor(
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private requirementService: RequirementService,
    private documentTypeService: DocumentTypeService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) { }

  requirements: Requirement[] = [];
  documentTypes: DocumentType[] = [];

  documentation: Documentation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  standardId: string = '';
  title: string = '';


  ngOnInit(): void {
    this.initMenuName();
    this.getTheme();
    this.initForm();
    this.initDocumentation();
    
    this.getAllDocumentTypes();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      this.standardId = params.get('id2').toString();
      this.obtain(this.id);
    });

    this.getAllRequirements();
    this.obtain(this.id);
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Versionamiento',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Documentación',
            isLink: false,
            link: '#'
          },
          {
            name: 'Versionamiento',
            isLink: false
          },
        ]
      }
    }
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

  initDocumentation() {
    this.documentation = new Documentation();
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


  obtain(id: string) {
    this.loading = true;
    this.documentationService.obtain(id)
      .subscribe((res: any) => {
        this.documentation = res.data;
        this.title = this.documentation.name.toUpperCase();
        this.setFormValue(this.documentation);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(documentation: Documentation) {
    this.form.setValue({
      name: ((documentation.name == null) ? '' : documentation.name),
      description: ((documentation.description == null) ? '' : documentation.description),
      template: ((documentation.template == null) ? '' : documentation.template),
      documentType: ((documentation.documentTypeId == null) ? '' : documentation.documentTypeId),
    });
  }

  getFormValue() {
    this.documentation.name = this.form.value.name;
    this.documentation.description = this.form.value.description;
    this.documentation.template = this.form.value.template;
    this.documentation.documentTypeId = this.form.value.documentType;
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

  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

   this.documentation.documentationId = Number(this.id);

    this.documentationService.update(this.documentation)
      .subscribe(res => {
        this.documentation = res.data;
        this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

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





 
  navigateToBack() {
    this.router.navigate(['/documentation-manager']);
  }

}
