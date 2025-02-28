import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Policy } from 'app/models/policy';
import { ErrorManager } from 'app/errors/error-manager';
import { PolicyService } from 'app/services/policy.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-policy',
  templateUrl: './edit-policy.component.html',
  styles: [
  ]
})
export class EditPolicyComponent implements OnInit {

  constructor(
    private policyService: PolicyService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditPolicyComponent>,

  ) { }


  policy: Policy;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = 'EDITAR POLICY';;

  ngOnInit(): void {
    this.initForm();


    this.initPolicy();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initPolicy() {
    this.policy = new Policy();
  }




  initForm() {
    this.form = this._formBuilder.group({
      isCurrent: [false, [Validators.required, Validators.maxLength(5),]],
      date: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.policyService.obtain(id)
      .subscribe((res: any) => {
        this.policy = res.data;
        this.setFormValue(this.policy); this.title = this.policy.name.toUpperCase();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(policy: Policy) {
    this.form.setValue({
      isCurrent: ((policy.isCurrent == null) ? '' : policy.isCurrent),
      date: ((policy.date == null) ? '' : policy.date),
      name: ((policy.name == null) ? '' : policy.name),
      description: ((policy.description == null) ? '' : policy.description),
    });
  }


  getFormValue() {
    this.policy.policyId = Number(this.id);
    this.policy.isCurrent = this.form.value.isCurrent;
    this.policy.date = this.form.value.date;
    this.policy.name = this.form.value.name;
    this.policy.description = this.form.value.description;
    if (this.form.value.description == "")
      this.policy.description = null;
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



    this.policyService.update(this.policy)
      .subscribe(res => {
        this.policy = res.data;
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

