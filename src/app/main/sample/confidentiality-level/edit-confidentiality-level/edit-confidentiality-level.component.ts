import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfidentialityLevel } from 'app/models/confidentiality-level';
import { ErrorManager } from 'app/errors/error-manager';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';
import { ConfidentialityLevelService } from 'app/services/confidentialityLevel.service';


@Component({
  selector: 'app-edit-confidentiality-level',
  templateUrl: './edit-confidentiality-level.component.html',
  styles: [
  ]
})
export class EditConfidentialityLevelComponent implements OnInit {

  constructor(
    private confidentialityLevelService: ConfidentialityLevelService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditConfidentialityLevelComponent>,

  ) { }


  confidentialityLevel: ConfidentialityLevel;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initConfidentialityLevel();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initConfidentialityLevel() {
    this.confidentialityLevel = new ConfidentialityLevel();
  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.confidentialityLevelService.obtain(id)
      .subscribe((res: any) => {
        this.confidentialityLevel = res.data;
        this.setFormValue(this.confidentialityLevel);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(confidentialityLevel: ConfidentialityLevel) {
    this.form.setValue({
      name: ((confidentialityLevel.name == null) ? '' : confidentialityLevel.name),
    });
  }


  getFormValue() {
    this.confidentialityLevel.name = this.form.value.name;
  }
  setNullValues() {
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

    this.confidentialityLevelService.update(this.confidentialityLevel)
      .subscribe(res => {
        this.confidentialityLevel = res.data;
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
