import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Custodian } from 'app/models/custodian';
import { ErrorManager } from 'app/errors/error-manager';
import { CustodianService } from 'app/services/custodian.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-custodian',
  templateUrl: './edit-custodian.component.html',
  styles: [
  ]
})
export class EditCustodianComponent implements OnInit {

  constructor(
    private custodianService: CustodianService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditCustodianComponent>,

  ) { }


  custodian: Custodian;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initCustodian();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initCustodian() {
    this.custodian = new Custodian();
  }


  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.custodianService.obtain(id)
      .subscribe((res: any) => {
        this.custodian = res.data;
        this.setFormValue(this.custodian);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(custodian: Custodian) {
    this.form.setValue({
      code: ((custodian.code == null) ? '' : custodian.code),
      name: ((custodian.name == null) ? '' : custodian.name),
    });
  }


  getFormValue() {
    this.custodian.custodianId = Number(this.id);
    this.custodian.code = this.form.value.code;
    this.custodian.name = this.form.value.name;
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



    this.custodianService.update(this.custodian)
      .subscribe(res => {
        this.custodian = res.data;
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

