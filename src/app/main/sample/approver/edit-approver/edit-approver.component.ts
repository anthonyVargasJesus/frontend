import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Approver } from 'app/models/approver';
import { ErrorManager } from 'app/errors/error-manager';
import { ApproverService } from 'app/services/approver.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from 'app/services/personal.service';
import { Personal } from 'app/models/personal';
import { ResponsibleService } from 'app/services/responsible.service';
import { Responsible } from 'app/models/responsible';
import { DialogData } from 'app/models/dialog-data';



@Component({
  selector: 'app-edit-approver',
  templateUrl: './edit-approver.component.html',
  styles: [
  ]
})
export class EditApproverComponent implements OnInit {

  constructor(
    private approverService: ApproverService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private personalService: PersonalService,
    private responsibleService: ResponsibleService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditApproverComponent>,

  ) { }

  personals: Personal[] = [];
  responsibles: Responsible[] = [];
  approver: Approver;
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
    this.approverService.obtain(id)
      .subscribe((res: any) => {
        this.approver = res.data;

        this.setFormValue(this.approver);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(approver: Approver) {

    this.form.setValue({
      personal: ((approver.personalId == 0) ? 0 : approver.personalId),
      responsible: ((approver.responsibleId == 0) ? 0 : approver.responsibleId),
    });

    console.log('approver', this.form.value);
  }

  getFormValue() {
    this.approver.personalId = this.form.value.personal;
    this.approver.responsibleId = this.form.value.responsible;
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


    this.approverService.update(this.approver)
      .subscribe(res => {
        this.approver = res.data;
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
