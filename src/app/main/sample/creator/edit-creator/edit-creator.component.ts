import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Creator } from 'app/models/creator';
import { ErrorManager } from 'app/errors/error-manager';
import { CreatorService } from 'app/services/creator.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from 'app/services/personal.service';
import { Personal } from 'app/models/personal';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-edit-creator',
  templateUrl: './edit-creator.component.html',
  styles: [
  ]
})
export class EditCreatorComponent implements OnInit {

  constructor(
    private creatorService: CreatorService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private personalService: PersonalService,
    private responsibleService: ResponsibleService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditCreatorComponent>,

  ) { }

  personals: Personal[] = [];
  responsibles: Responsible[] = [];
  creator: Creator;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  public last: string = '';
  standardId: number;


  ngOnInit(): void {
    this.initForm();
     this.id = this.data['_id'];
     this.standardId = this.data['standardId'];
     this.getAllPersonals();
     this.getAllResponsibles();
     this.obtain(this.id);
  }


  initForm() {
    this.form = this._formBuilder.group({
      personal: [0, []],
      responsible: [0, []],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.creatorService.obtain(id)
      .subscribe((res: any) => {
        this.creator = res.data;

        this.setFormValue(this.creator);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(creator: Creator) {
  
    this.form.setValue({
      personal: ((creator.personalId == 0) ? 0 : creator.personalId),
      responsible: ((creator.responsibleId == 0) ? 0 : creator.responsibleId),
    });

  }

  getFormValue() {
    this.creator.personalId = this.form.value.personal;
    this.creator.responsibleId = this.form.value.responsible;
  }

  getAllPersonals() {
    this.personalService.getAll()
      .subscribe((res: any) => {
        this.personals = res.data;
      }, error => {
        ErrorManager.handleError(error);
      });
  }
  getAllResponsibles() {
    this.responsibleService.getAll(this.standardId)
      .subscribe((res: any) => {
        this.responsibles = res.data;
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


    this.creatorService.update(this.creator)
      .subscribe(res => {
        this.creator = res.data;
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
