import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from 'app/models/location';
import { ErrorManager } from 'app/errors/error-manager';
import { LocationService } from 'app/services/location.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styles: [
  ]
})
export class EditLocationComponent implements OnInit {

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditLocationComponent>,

  ) { }


  location: Location;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initLocation();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initLocation() {
    this.location = new Location();
  }


  initForm() {
    this.form = this._formBuilder.group({
      abbreviation: ['', [Validators.maxLength(10),]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.locationService.obtain(id)
      .subscribe((res: any) => {
        this.location = res.data;
        this.setFormValue(this.location);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(location: Location) {
    this.form.setValue({
      abbreviation: ((location.abbreviation == null) ? '' : location.abbreviation),
      name: ((location.name == null) ? '' : location.name),
    });
  }


  getFormValue() {
    this.location.locationId = Number(this.id);
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



    this.locationService.update(this.location)
      .subscribe(res => {
        this.location = res.data;
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

