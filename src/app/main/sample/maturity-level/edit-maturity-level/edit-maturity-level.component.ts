import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MaturityLevel } from 'app/models/maturity-level';
import { ErrorManager } from 'app/errors/error-manager';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-maturity-level',
  templateUrl: './edit-maturity-level.component.html',
  styles: [
  ]
})
export class EditMaturityLevelComponent implements OnInit {

  constructor(
    private maturityLevelService: MaturityLevelService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditMaturityLevelComponent>,

  ) { }


  maturityLevel: MaturityLevel;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.initMaturityLevel();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initMaturityLevel() {
    this.maturityLevel = new MaturityLevel();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),]],
      description: ['', [Validators.required, Validators.maxLength(500),]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10),]],
      value: ['', [Validators.required, Validators.maxLength(8),]],
      color: ['', [Validators.required, Validators.maxLength(100),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.maturityLevelService.obtain(id)
      .subscribe((res: any) => {
        this.maturityLevel = res.data;

        this.setNullValues();
        this.setFormValue(this.maturityLevel);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(maturityLevel: MaturityLevel) {
    this.form.setValue({
      name: ((maturityLevel.name == null) ? '' : maturityLevel.name),
      description: ((maturityLevel.description == null) ? '' : maturityLevel.description),
      abbreviation: ((maturityLevel.abbreviation == null) ? '' : maturityLevel.abbreviation),
      value: ((maturityLevel.value == null) ? '' : maturityLevel.value),
      color: ((maturityLevel.color == null) ? '' : maturityLevel.color),
    });
  }


  getFormValue() {
    this.maturityLevel.name = this.form.value.name;
    this.maturityLevel.description = this.form.value.description;
    this.maturityLevel.abbreviation = this.form.value.abbreviation;
    this.maturityLevel.value = this.form.value.value;
    this.maturityLevel.color = this.form.value.color;
  }
  setNullValues() {
  }


  get f() {
    return this.form.controls;
  }

  setArray() {
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();
    this.setArray();


    this.maturityLevelService.update(this.maturityLevel)
      .subscribe(res => {
        this.maturityLevel = res.data;
        this.setNullValues();
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

