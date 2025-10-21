import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subprocess } from 'app/models/subprocess';
import { ErrorManager } from 'app/errors/error-manager';
import { SubprocessService } from 'app/services/subprocess.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MacroprocessService } from 'app/services/macroprocess.service';
import { Macroprocess } from 'app/models/macroprocess';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-subprocess',
  templateUrl: './edit-subprocess.component.html',
  styles: [
  ]
})
export class EditSubprocessComponent implements OnInit {

  constructor(
    private subprocessService: SubprocessService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private macroprocessService: MacroprocessService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditSubprocessComponent>,

  ) { }

  macroprocesss: Macroprocess[] = [];

  subprocess: Subprocess;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();

    this.getAllMacroprocesss();

    this.initSubprocess();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initSubprocess() {
    this.subprocess = new Subprocess();
    this.initMacroprocess();
  }


  initMacroprocess() {
    if (this.macroprocesss.length > 0)
      this.subprocess.macroprocess = this.macroprocesss[0];
  }

  initForm() {
    this.form = this._formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(20),]],
      name: ['', [Validators.required, Validators.maxLength(100),]],
      macroprocess: ['', [Validators.required,]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.subprocessService.obtain(id)
      .subscribe((res: any) => {
        this.subprocess = res.data;
        this.setFormValue(this.subprocess);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(subprocess: Subprocess) {
    this.form.setValue({
      code: ((subprocess.code == null) ? '' : subprocess.code),
      name: ((subprocess.name == null) ? '' : subprocess.name),
      macroprocess: ((subprocess.macroprocessId == null) ? '' : subprocess.macroprocessId),
    });
  }


  getFormValue() {
    this.subprocess.subprocessId = Number(this.id);
    this.subprocess.code = this.form.value.code;
    this.subprocess.name = this.form.value.name;
    this.subprocess.macroprocessId = this.form.value.macroprocess;
  }

  getAllMacroprocesss() {
    this.macroprocessService.getAll()
      .subscribe((res: any) => {
        this.macroprocesss = res.data;
        this.initSubprocess();
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



    this.subprocessService.update(this.subprocess)
      .subscribe(res => {
        this.subprocess = res.data;
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
