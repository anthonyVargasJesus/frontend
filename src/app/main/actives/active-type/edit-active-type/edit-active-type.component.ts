import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActiveType } from 'app/models/active-type';
import { ErrorManager } from 'app/errors/error-manager';
import { ActiveTypeService } from 'app/services/active-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-active-type',
  templateUrl: './edit-active-type.component.html',
  styles: [
  ]
})
export class EditActiveTypeComponent implements OnInit {

  constructor(
    private activeTypeService: ActiveTypeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditActiveTypeComponent>,

  ) { }


  activeType: ActiveType = new ActiveType();
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initActiveType();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initActiveType() {
    this.activeType = new ActiveType();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.activeTypeService.obtain(id)
      .subscribe((res: any) => {
        this.activeType = res.data;
        this.setFormValue(this.activeType);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(activeType: ActiveType) {
    this.form.setValue({
      name: ((activeType.name == null) ? '' : activeType.name),
    });
  }


  getFormValue() {
    this.activeType.activeTypeId = Number(this.id);
    this.activeType.name = this.form.value.name;
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



    this.activeTypeService.update(this.activeType)
      .subscribe(res => {
        this.activeType = res.data;
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

