import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SupportType } from 'app/models/support-type';
import { ErrorManager } from 'app/errors/error-manager';
import { SupportTypeService } from 'app/services/support-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-support-type',
  templateUrl: './edit-support-type.component.html',
  styles: [
  ]
})
export class EditSupportTypeComponent implements OnInit {

  constructor(
    private supportTypeService: SupportTypeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditSupportTypeComponent>,

  ) { }


  supportType: SupportType;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initSupportType();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initSupportType() {
    this.supportType = new SupportType();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.supportTypeService.obtain(id)
      .subscribe((res: any) => {
        this.supportType = res.data;
        this.setFormValue(this.supportType);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(supportType: SupportType) {
    this.form.setValue({
      name: ((supportType.name == null) ? '' : supportType.name),
    });
  }


  getFormValue() {
    this.supportType.supportTypeId = Number(this.id);
    this.supportType.name = this.form.value.name;
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



    this.supportTypeService.update(this.supportType)
      .subscribe(res => {
        this.supportType = res.data;
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
