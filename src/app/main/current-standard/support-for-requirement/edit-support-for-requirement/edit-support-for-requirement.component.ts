import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SupportForRequirement } from 'app/models/support-for-requirement';
import { ErrorManager } from 'app/errors/error-manager';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequirementService } from 'app/services/requirement.service';
import { Requirement } from 'app/models/requirement';
import { DialogData } from 'app/models/dialog-data';
import { SupportForRequirementService } from 'app/services/supportForRequirement.service';


@Component({
  selector: 'app-edit-support-for-requirement',
  templateUrl: './edit-support-for-requirement.component.html',
  styles: [
  ]
})
export class EditSupportForRequirementComponent implements OnInit {

  constructor(
    private supportForRequirementService: SupportForRequirementService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private requirementService: RequirementService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditSupportForRequirementComponent>,

  ) { }

  requirements: Requirement[] = [];

  supportForRequirement: SupportForRequirement;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = '';

  standardId: number;

  ngOnInit(): void {
    this.id = this.data['_id'];
    this.standardId = this.data['standardId'];
    this.initForm();
    this.getAllRequirements();
    this.initSupportForRequirement();


  }


  initSupportForRequirement() {
    this.supportForRequirement = new SupportForRequirement();
  }

  initForm() {
    this.form = this._formBuilder.group({
      requirement: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.supportForRequirementService.obtain(id)
      .subscribe((res: any) => {
        this.supportForRequirement = res.data;

        this.title = this.getTitle(this.supportForRequirement.requirementId);

        this.setFormValue(this.supportForRequirement);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(supportForRequirement: SupportForRequirement) {
    this.form.setValue({
      requirement: ((supportForRequirement.requirementId == null) ? '' : supportForRequirement.requirementId),
    });
  }

  getTitle(requirementId: number) {
    let name = '';
    this.requirements.forEach(item => {
    
      if (item.requirementId == requirementId)
        name = item.name;
    });
    return name;
  }

  getFormValue() {
    if (this.form.value.requirement)
      this.supportForRequirement.requirementId = this.form.value.requirement;
  }


  getAllRequirements() {
    this.requirementService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.requirements = res.data;
        this.obtain(this.id);
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

    this.supportForRequirementService.update(this.supportForRequirement)
      .subscribe(res => {
        this.supportForRequirement = res.data;
        this.dialogRef.close({ updated: true });
        this.loading2 = false;
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }

  close() {
    this.dialogRef.close();
  }

}
