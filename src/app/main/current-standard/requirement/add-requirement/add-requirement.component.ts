import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { Requirement } from 'app/models/requirement';
import { RequirementService } from 'app/services/requirement.service';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';

@Component({
  selector: 'app-add-requirement',
  templateUrl: './add-requirement.component.html',
  styles: [
  ]
})
export class AddRequirementComponent implements OnInit {


  constructor(
    private requirementService: RequirementService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddRequirementComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private responsibleService: ResponsibleService,

  ) { }

  requirements: Requirement[] = [];
  responsibles: Responsible[] = [];

  requirement: Requirement = new Requirement();
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  standardId: string;
  requirementId: string;
  level: string;

  ngOnInit(): void {

    this.standardId = this.data['standardId'];
    this.requirementId = this.data['requirementId'];
    this.level = this.data['level'];

    this.initForm();
    this.getAllRequirements();
    this.getAllResponsibles();
  }

  initForm() {
    this.form = this._formBuilder.group({
      numeration: ['', [Validators.required, Validators.maxLength(8),]],
      letter: ['', [ Validators.maxLength(10),]],
      name: ['', [Validators.required, Validators.maxLength(500),]],
      description: ['', [Validators.maxLength(1000),]],
      level: [Number(this.level), [Validators.required, Validators.maxLength(8),]],
      parentId: [Number(this.requirementId), []],
      isEvaluable: [false, [Validators.maxLength(5),]],
      defaultResponsible: ['', []],
    });
  }

  getAllRequirements() {
    this.requirementService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.requirements = res.data;
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getAllResponsibles() {
    this.responsibleService.getAll(Number(this.standardId))
      .subscribe((res: any) => {
        this.responsibles = res.data;
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.requirement.numeration = this.form.value.numeration;
    this.requirement.name = this.form.value.name;
    this.requirement.description = this.form.value.description;
    this.requirement.level = this.form.value.level;
    this.requirement.parentId = this.form.value.parentId;
    this.requirement.isEvaluable = this.form.value.isEvaluable;
    this.requirement.letter = this.form.value.letter;
    this.requirement.defaultResponsibleId = this.form.value.defaultResponsible ? this.form.value.defaultResponsible : null;
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

    this.requirement.standardId = Number(this.standardId);

    this.requirementService.insert(this.requirement)
      .subscribe(res => {
        this.requirement = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } close() {
    this.dialogRef.close();
  }
}
