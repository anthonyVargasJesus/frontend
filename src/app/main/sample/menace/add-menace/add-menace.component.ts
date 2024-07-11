import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Menace } from 'app/models/menace';
import { ErrorManager } from 'app/errors/error-manager';
import { MenaceService } from 'app/services/menace.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MenaceTypeService } from 'app/services/menace-type.service';
import { MenaceType } from 'app/models/menace-type';



@Component({
  selector: 'app-add-menace',
  templateUrl: './add-menace.component.html',
  styles: [
  ]
})


export class AddMenaceComponent implements OnInit {

  constructor(
    private menaceService: MenaceService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddMenaceComponent>, private menaceTypeService: MenaceTypeService,


  ) { }

  menaceTypes: MenaceType[] = [];

  menace: Menace;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();
    this.getAllMenaceTypes();

    this.initMenace();

  }

  initForm() {
    this.form = this._formBuilder.group({
      menaceType: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initMenace() {
    this.menace = new Menace();
  }



  getAllMenaceTypes() {
    this.menaceTypeService.getAll()
      .subscribe((res: any) => {
        this.menaceTypes = res.data;
        this.initMenace();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.menace.menaceTypeId = this.form.value.menaceType;
    this.menace.name = this.form.value.name;
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



    this.menaceService.insert(this.menace)
      .subscribe(res => {
        this.menace = res.data;
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

