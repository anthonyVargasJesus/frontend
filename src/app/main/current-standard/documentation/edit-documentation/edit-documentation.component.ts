import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Documentation } from 'app/models/documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentationService } from 'app/services/documentation.service';
import { MatDialog } from '@angular/material/dialog';
import { Requirement } from 'app/models/requirement';
import { DocumentTypeService } from 'app/services/document-type.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
// import { AddDocumentTypeComponent } from '../../document-type/add-document-type/add-document-type.component';
import { StandardService } from 'app/services/standard.service';
import { Standard } from 'app/models/standard';


@Component({
  selector: 'app-edit-documentation',
  templateUrl: './edit-documentation.component.html',
  styles: [
  ]
})


export class EditDocumentationComponent implements OnInit {

  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  constructor(
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router,
    private documentTypeService: DocumentTypeService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog,
    private standardService: StandardService,
  ) { }

  requirements: Requirement[] = [];
  documentTypes: DocumentType[] = [];

  documentation: Documentation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  standardId: number ;
  title: string = '';
  public contentHeader: object;
  standard: Standard = new Standard();

  ngOnInit(): void {

    this.getTheme();
    this.initForm();
    this.initDocumentation();
    this.getAllDocumentTypes();

  
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      this.obtain(this.id);
    });

    //this.standardId = this.data['standardId'];


    //this.getAllRequirements();
    //this.obtain(this.id);
  }

  obtainStandard(id: number) {
    this.loading = true;
    this.standardService.obtain(id.toString())
      .subscribe((res: any) => {
        this.standard = res.data;
 
        this.loading = false;
        this.initMenuName();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  initMenuName() {

    let title = '';
    if (this.standard)
      title = this.standard.name;

    this.contentHeader = {
      headerTitle: 'Documentación',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: title,
            isLink: false,
            link: '#'
          },
          {
            name: 'Documentación',
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
        this.standardId = this.documentation.standardId;
        this.obtainStandard(this.standardId);
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

  // getAllRequirements() {
  //   this.requirementService.getAll(Number(this.standardId))
  //     .subscribe((res: any) => {
  //       this.requirements = res.data;
  //       this.initDocumentation();
  //     }, error => {
  //       ErrorManager.handleError(error);
  //     });
  // }

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

    // if (this.loginService.isAuthenticated()) {
    //   let dialogRef = this.dialog.open(AddDocumentTypeComponent, {
    //     height: '500px',
    //     width: '500px',
    //     autoFocus: false, panelClass: this.panelClass
    //   });

    //   dialogRef.afterClosed().subscribe(data => {
    //     if (data == null)
    //       return;

    //     if (data.updated == true)
    //       this.getAllDocumentTypes();
    //   });
    // }

  }

  navigateToBack() {
    this.router.navigate(['/current-standard/documentation', this.standardId]);
  }

}

