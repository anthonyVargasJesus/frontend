import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { Requirement } from 'app/models/requirement';
import { RequirementService } from 'app/services/requirement.service';

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

  ) { }

  requirements: Requirement[] = [];

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
  }

  initForm() {
    this.form = this._formBuilder.group({
      numeration: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
      description: ['', [Validators.maxLength(1000),]],
      level: [Number(this.level), [Validators.required, Validators.maxLength(8),]],
      parentId: [Number(this.requirementId), []],
      isEvaluable: [false, [Validators.maxLength(5),]],
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


  getFormValue() {
    this.requirement.numeration = this.form.value.numeration;
    this.requirement.name = this.form.value.name;
    this.requirement.description = this.form.value.description;
    this.requirement.level = this.form.value.level;
    this.requirement.parentId = this.form.value.parentId;
    this.requirement.isEvaluable = this.form.value.isEvaluable;
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
