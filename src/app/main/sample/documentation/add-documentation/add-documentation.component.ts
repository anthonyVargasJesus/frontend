import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Documentation } from 'app/models/documentation';
import { ErrorManager } from 'app/errors/error-manager';
import { DocumentationService } from 'app/services/documentation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequirementService } from 'app/services/requirement.service';
import { Requirement } from 'app/models/requirement';
import { Standard } from 'app/models/standard';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-add-documentation',
  templateUrl: './add-documentation.component.html',
  styles: [
  ]
})
export class AddDocumentationComponent implements OnInit {

  constructor(
    private documentationService: DocumentationService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddDocumentationComponent>, 
    private requirementService: RequirementService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  requirements: Requirement[] = [];

  documentation: Documentation;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  standardId: string;

  ngOnInit(): void {
    this.initForm();
    this.standardId = this.data['standardId'];
    this.getAllRequirements();
    this.initDocumentation();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
      template: ['', [Validators.maxLength(250),]],
    });
  }

  initDocumentation() {
    this.documentation = new Documentation();
  }


  getAllRequirements() {
    this.requirementService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.requirements = res.data;
        console.log('res', res);
        this.initDocumentation();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.documentation.name = this.form.value.name;
    this.documentation.description = this.form.value.description;
    this.documentation.template = this.form.value.template;
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

}