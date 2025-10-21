import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Location } from 'app/models/location';
import { ErrorManager } from 'app/errors/error-manager';
import { LocationService } from 'app/services/location.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styles: [
  ]
})


export class AddLocationComponent implements OnInit {

  constructor(
    private locationService: LocationService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddLocationComponent>,

  ) { }


  location: Location;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initLocation();

  }

  initForm() {
    this.form = this._formBuilder.group({
      abbreviation: ['', [Validators.maxLength(10),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  initLocation() {
    this.location = new Location();
  }




  getFormValue() {
    this.location.abbreviation = this.form.value.abbreviation;
    this.location.name = this.form.value.name;
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



    this.locationService.insert(this.location)
      .subscribe(res => {
        this.location = res.data;
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

