import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { Standard } from 'app/models/standard';
import { StandardService } from 'app/services/standard.service';

@Component({
  selector: 'app-add-standard',
  templateUrl: './add-standard.component.html',
  styles: [
  ]
})
export class AddStandardComponent implements OnInit {

  constructor(
    private standardService: StandardService,
    public router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddStandardComponent>,


  ) { }

  standards: Standard[] = [];

  standard: Standard;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm(); 
    this.getAllStandards();

    this.initStandard();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      parentId: [0, []],
    });
  }

  initStandard() {
    this.standard = new Standard();
  }

  setNullValues() {


  }


  getAllStandards() {
    this.standardService.getAll()
      .subscribe((res: any) => {
        this.standards = res.data;
        this.initStandard();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.standard.name = this.form.value.name;
    this.standard.description = this.form.value.description;
    this.standard.parentId = this.form.value.parentId;
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

    this.standardService.insert(this.standard)
      .subscribe(res => {


        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } close() {
    this.dialogRef.close();
  }


}
