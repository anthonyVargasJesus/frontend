import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Owner } from 'app/models/owner';
import { ErrorManager } from 'app/errors/error-manager';
import { OwnerService } from 'app/services/owner.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styles: [
  ]
})

export class EditOwnerComponent implements OnInit {

  constructor(
    private ownerService: OwnerService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditOwnerComponent>,

  ) { }


  owner: Owner;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initOwner();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initOwner() {
    this.owner = new Owner();
  }


  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.ownerService.obtain(id)
      .subscribe((res: any) => {
        this.owner = res.data;
        this.setFormValue(this.owner);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(owner: Owner) {
    this.form.setValue({
      code: ((owner.code == null) ? '' : owner.code),
      name: ((owner.name == null) ? '' : owner.name),
    });
  }


  getFormValue() {
    this.owner.ownerId = Number(this.id);
    this.owner.code = this.form.value.code;
    this.owner.name = this.form.value.name;
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

    this.ownerService.update(this.owner)
      .subscribe(res => {
        this.owner = res.data;
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

