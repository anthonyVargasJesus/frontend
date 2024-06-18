import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Option } from 'app/models/option';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionService } from 'app/services/option.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-option',
  templateUrl: './edit-option.component.html',
  styles: [
  ]
})
export class EditOptionComponent implements OnInit {

  constructor(
    private optionService: OptionService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditOptionComponent>,

  ) { }

  option: Option;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;

  ngOnInit(): void {
    this.initForm();
    this.initOption();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initOption() {
    this.option = new Option();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      image: ['', [Validators.maxLength(200),]],
      url: ['', [Validators.required, Validators.maxLength(200),]],
      isMobile: [false, [Validators.maxLength(5),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.optionService.obtain(id)
      .subscribe((res: any) => {
        this.option = res.data;
        this.setFormValue(this.option);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(option: Option) {
    this.form.setValue({
      name: ((option.name == null) ? '' : option.name),
      image: ((option.image == null) ? '' : option.image),
      url: ((option.url == null) ? '' : option.url),
      isMobile: ((option.isMobile == null) ? '' : option.isMobile),
    });
  }


  getFormValue() {
    this.option.optionId = Number(this.id);
    this.option.name = this.form.value.name;
    this.option.image = this.form.value.image;
    this.option.url = this.form.value.url;
    this.option.isMobile = this.form.value.isMobile;
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



    this.optionService.update(this.option)
      .subscribe(res => {
        this.option = res.data;
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

