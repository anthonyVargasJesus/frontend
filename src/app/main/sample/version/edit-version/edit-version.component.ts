import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Version } from 'app/models/version';
import { ErrorManager } from 'app/errors/error-manager';
import { VersionService } from 'app/services/version.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfidentialityLevel } from 'app/models/confidentiality-level';
import { DialogData } from 'app/models/dialog-data';
import { ConfidentialityLevelService } from 'app/services/confidentialityLevel.service';


@Component({
  selector: 'app-edit-version',
  templateUrl: './edit-version.component.html',
  styles: [
  ]
})
export class EditVersionComponent implements OnInit {


  constructor(
    private versionService: VersionService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private confidentialityLevelService: ConfidentialityLevelService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditVersionComponent>,

  ) { }

  confidentialityLevels: ConfidentialityLevel[] = [];

  version: Version;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public title: string = '';

  documentationId: number;

  standardId: number;

  ngOnInit(): void {
    this.initForm();

    this.getAllConfidentialityLevels();

    this.initVersion();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initVersion() {
    this.version = new Version();
    this.initConfidentialityLevel();
  }



  initConfidentialityLevel() {
    if (this.confidentialityLevels.length > 0)
      this.version.confidentialityLevel = this.confidentialityLevels[0];
  }

  initForm() {
    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(8),]],
      code: ['', [Validators.required, Validators.maxLength(100),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
      confidentialityLevel: [0, [Validators.required,]],
      date: ['', [Validators.required,]],
      isCurrent: [false],
      //fileName: ['', [Validators.maxLength(500),]],
      description: ['', [Validators.maxLength(500),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.versionService.obtain(id)
      .subscribe((res: any) => {
        this.version = res.data;
        this.documentationId = this.version.documentationId;
        this.standardId = this.version.standardId;
        this.title = this.version.name + ' v' + this.version.number.toFixed(2);
        this.setNullValues();
        this.setFormValue(this.version);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(version: Version) {
    this.form.setValue({
      number: ((version.number == null) ? '' : version.number),
      code: ((version.code == null) ? '' : version.code),
      name: ((version.name == null) ? '' : version.name),
      confidentialityLevel: ((version.confidentialityLevelId == null) ? '' : version.confidentialityLevelId),
      //fileName: ((version.fileName == null) ? '' : version.fileName),
      date: ((version.date == null) ? '' : version.date),
      isCurrent: ((version.isCurrent == null) ? '' : version.isCurrent),
      description: ((version.description == null) ? '' : version.description),
      // standardId: ((version.standardId == null) ? '' : version.standardId),
      // companyId: ((version.companyId == null) ? '' : version.companyId),
    });
  }

  getFormValue() {
    this.version.number = this.form.value.number;
    this.version.code = this.form.value.code;
    this.version.name = this.form.value.name;
     if (this.form.value.confidentialityLevel)
    this.version.confidentialityLevelId = this.form.value.confidentialityLevel;
    this.version.date = this.form.value.date;
    this.version.isCurrent = this.form.value.isCurrent;
    //this.version.fileName = this.form.value.fileName;
    this.version.description = this.form.value.description;
  }


  setNullValues() {

    if (!this.version.confidentialityLevel)
      this.initConfidentialityLevel();
  }
  getAllConfidentialityLevels() {
    this.confidentialityLevelService.getAll()
      .subscribe((res: any) => {
        this.confidentialityLevels = res.data;
        this.initVersion();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  get f() {
    return this.form.controls;
  }

  save() {

    console.log(this.form);

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();
    this.version.versionId = Number(this.id);

    this.versionService.update(this.version)
      .subscribe(res => {
        this.version = res.data;
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
