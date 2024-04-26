import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Documentation } from 'app/models/documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentationService } from 'app/services/documentation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequirementService } from 'app/services/requirement.service';
import { Requirement } from 'app/models/requirement';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-documentation-manager',
  templateUrl: './edit-documentation-manager.component.html',
  styles: [
  ]
})
export class EditDocumentationManagerComponent implements OnInit {

  constructor(
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private requirementService: RequirementService

  ) { }

  requirements: Requirement[] = [];

  documentation: Documentation;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;

  public title: string = '';
  public subtitle: string = '';

  standardId: string = '';
  public contentHeader: object;

  ngOnInit(): void {
    this.initMenuName();
    this.initForm();
    this.initDocumentation();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      this.standardId = params.get('id2').toString();
      this.obtain(this.id);
    });
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

  initDocumentation() {
    this.documentation = new Documentation();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      template: ['', [Validators.maxLength(250),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.documentationService.obtain(id)
      .subscribe((res: any) => {
        this.documentation = res.data;
        this.title = this.documentation.name;
        this.subtitle = this.documentation.description;
        this.setFormValue(this.documentation);
        this.loading = false;

        this.standardId = this.documentation.standardId.toString();
        this.getAllRequirements();

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
    });
  }


  getFormValue() {
    this.documentation.name = this.form.value.name;
    this.documentation.description = this.form.value.description;
    this.documentation.template = this.form.value.template;
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

    this.documentationService.update(this.documentation)
      .subscribe(res => {
        this.documentation = res.data;
        this.loading2 = false;

      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  navigateToBack() {
    this.router.navigate(['/documentation-manager']);
  }

}
