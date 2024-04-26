import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Creator } from 'app/models/creator';
import { ErrorManager } from 'app/errors/error-manager';
import { CreatorService } from 'app/services/creator.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from 'app/services/personal.service';
import { Personal } from 'app/models/personal';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { VersionService } from 'app/services/version.service';
import { Version } from 'app/models/version';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-add-creator',
  templateUrl: './add-creator.component.html',
  styles: [
  ]
})
export class AddCreatorComponent implements OnInit {


  constructor(
    private creatorService: CreatorService,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddCreatorComponent>, private personalService: PersonalService,
    private responsibleService: ResponsibleService,
    private versionService: VersionService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }

  personals: Personal[] = [];
  responsibles: Responsible[] = [];
  versions: Version[] = [];

  creator: Creator;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;

  versionId: string;
  standardId: number;
  documentationId: number;

  ngOnInit(): void {
    this.initForm();
    this.versionId = this.data['versionId'];
    this.standardId = this.data['standardId'];
    this.documentationId = this.data['documentationId'];
    this.getAllPersonals();
    this.getAllResponsibles();
    this.initCreator();
  }

  initForm() {
    this.form = this._formBuilder.group({
      personal: [0, []],
      responsible: [0, []],
    });
  }

  initCreator() {
    this.creator = new Creator();
  }

  getAllPersonals() {
    this.personalService.getAll()
      .subscribe((res: any) => {
        this.personals = res.data;
        this.initCreator();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getAllResponsibles() {
    this.responsibleService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.responsibles = res.data;
        this.initCreator();
      }, error => {
        ErrorManager.handleError(error);
      });
  }

  getFormValue() {
    this.creator.personalId = this.form.value.personal;
    this.creator.responsibleId = this.form.value.responsible;
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

    this.creator.versionId = Number(this.versionId); 
    this.creator.documentationId = Number(this.documentationId); 


    this.creatorService.insert(this.creator)
      .subscribe(res => {
        this.creator = res.data;
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } 
  
  close() {
    this.dialogRef.close();
  }


}
