import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MenaceType } from 'app/models/menace-type';
import { ErrorManager } from 'app/errors/error-manager';
import { MenaceTypeService } from 'app/services/menace-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-menace-type',
  templateUrl: './edit-menace-type.component.html',
  styles: [
  ]
})
export class EditMenaceTypeComponent implements OnInit {

  constructor(
    private menaceTypeService: MenaceTypeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditMenaceTypeComponent>,

  ) { }


  menaceType: MenaceType;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initMenaceType();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initMenaceType() {
    this.menaceType = new MenaceType();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.menaceTypeService.obtain(id)
      .subscribe((res: any) => {
        this.menaceType = res.data;
        this.setFormValue(this.menaceType);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(menaceType: MenaceType) {
    this.form.setValue({
      name: ((menaceType.name == null) ? '' : menaceType.name),
    });
  }


  getFormValue() {
    this.menaceType.menaceTypeId = Number(this.id);
    this.menaceType.name = this.form.value.name;
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



    this.menaceTypeService.update(this.menaceType)
      .subscribe(res => {
        this.menaceType = res.data;
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

