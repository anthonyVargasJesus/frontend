import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Menace } from 'app/models/menace';
import { ErrorManager } from 'app/errors/error-manager';
import { MenaceService } from 'app/services/menace.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenaceTypeService } from 'app/services/menace-type.service';
import { MenaceType } from 'app/models/menace-type';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-menace',
  templateUrl: './edit-menace.component.html',
  styles: [
  ]
})
export class EditMenaceComponent implements OnInit {

  constructor(
    private menaceService: MenaceService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private menaceTypeService: MenaceTypeService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditMenaceComponent>,

  ) { }

  menaceTypes: MenaceType[] = [];

  menace: Menace;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();

    this.getAllMenaceTypes();

    this.initMenace();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initMenace() {
    this.menace = new Menace();
    this.initMenaceType();
  }
  initMenaceType() {
    if (this.menaceTypes.length > 0)
      this.menace.menaceType = this.menaceTypes[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      menaceType: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.menaceService.obtain(id)
      .subscribe((res: any) => {
        this.menace = res.data;
        this.setFormValue(this.menace);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(menace: Menace) {
    this.form.setValue({
      menaceType: ((menace.menaceTypeId == null) ? '' : menace.menaceTypeId),
      name: ((menace.name == null) ? '' : menace.name),
    });
  }


  getFormValue() {
    this.menace.menaceId = Number(this.id);
    this.menace.menaceTypeId = this.form.value.menaceType;
    this.menace.name = this.form.value.name;
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();



    this.menaceService.update(this.menace)
      .subscribe(res => {
        this.menace = res.data;
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

