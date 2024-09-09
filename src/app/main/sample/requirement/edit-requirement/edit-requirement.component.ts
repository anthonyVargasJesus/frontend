import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Requirement } from 'app/models/requirement';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementService } from 'app/services/requirement.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styles: [
  ]
})
export class EditRequirementComponent implements OnInit {

  constructor(
    private requirementService: RequirementService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, 
    private dialogRef: MatDialogRef<EditRequirementComponent>,

  ) { }

  requirements: Requirement[] = [];

  requirement: Requirement;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initRequirement();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initRequirement() {
    this.requirement = new Requirement();
  }



  initForm() {
    this.form = this._formBuilder.group({
      numeration: ['', [Validators.required, Validators.maxLength(8),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
      description: ['', [Validators.maxLength(1000),]],
      level: ['', [Validators.required, Validators.maxLength(8),]],
      parentId: [0, []],
      isEvaluable: [false, [Validators.maxLength(5),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.requirementService.obtain(id)
      .subscribe((res: any) => {
        this.requirement = res.data;
        this.getAllRequirements(this.requirement.standardId);
        this.setFormValue(this.requirement);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(requirement: Requirement) {
    this.form.setValue({
      numeration: ((requirement.numeration == null) ? '' : requirement.numeration),
      name: ((requirement.name == null) ? '' : requirement.name),
      description: ((requirement.description == null) ? '' : requirement.description),
      level: ((requirement.level == null) ? '' : requirement.level),
      parentId: ((requirement.parentId == null) ? '' : requirement.parentId),
      isEvaluable: ((requirement.isEvaluable == null) ? '' : requirement.isEvaluable),
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

  getAllRequirements(standardId: number) {
    this.requirementService.getAll(standardId)
      .subscribe((res: any) => {
        this.requirements = res.data;
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

    this.requirementService.update(this.requirement)
      .subscribe(res => {
        this.requirement = res.data;
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
