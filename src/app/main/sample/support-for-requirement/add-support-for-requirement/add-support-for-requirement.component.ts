import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SupportForRequirement } from 'app/models/support-for-requirement';
import { ErrorManager } from 'app/errors/error-manager';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequirementService } from 'app/services/requirement.service';
import { Requirement } from 'app/models/requirement';
import { SupportForRequirementService } from 'app/services/supportForRequirement.service';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-support-for-requirement',
  templateUrl: './add-support-for-requirement.component.html',
  styles: [
  ]
})


export class AddSupportForRequirementComponent implements OnInit {

  constructor(
    private supportForRequirementService: SupportForRequirementService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddSupportForRequirementComponent>,
    private requirementService: RequirementService, @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  requirements: Requirement[] = [];

  supportForRequirement: SupportForRequirement;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  standardId: number;
  documentationId: number;

  ngOnInit(): void {
    this.standardId = this.data['standardId'];
    this.documentationId = this.data['documentationId'];

    this.initForm();
    this.getAllRequirements();
    this.initSupportForRequirement();
  }

  initForm() {
    this.form = this._formBuilder.group({
      requirement: ['', [Validators.required,]],
    });
  }

  initSupportForRequirement() {
    this.supportForRequirement = new SupportForRequirement();
  }


  getAllRequirements() {
    this.requirementService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.requirements = res.data;
        this.initSupportForRequirement();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    if (this.form.value.requirement)
      this.supportForRequirement.requirementId = this.form.value.requirement;
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

    this.supportForRequirement.standardId = this.standardId;
    this.supportForRequirement.documentationId = this.documentationId;

    this.supportForRequirementService.insert(this.supportForRequirement)
      .subscribe(res => {
        this.supportForRequirement = res.data;
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

