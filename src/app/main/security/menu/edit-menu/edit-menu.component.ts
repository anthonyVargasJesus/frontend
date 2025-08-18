import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Menu } from 'app/models/menu';
import { ErrorManager } from 'app/errors/error-manager';
import { MenuService } from 'app/services/menu.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styles: [
  ]
})
export class EditMenuComponent implements OnInit {

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditMenuComponent>,

  ) { }


  menu: Menu;
  loading = false;
  id: string;
  loading2 = false; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();


    this.initMenu();

    this.id = this.data['_id'];
    this.obtain(this.id);


  }


  initMenu() {
    this.menu = new Menu();
  }


  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      image: ['', [Validators.maxLength(200),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.menuService.obtain(id)
      .subscribe((res: any) => {
        this.menu = res.data;
        this.setFormValue(this.menu);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(menu: Menu) {
    this.form.setValue({
      name: ((menu.name == null) ? '' : menu.name),
      image: ((menu.image == null) ? '' : menu.image),
    });
  }


  getFormValue() {
    this.menu.menuId = Number(this.id);
    this.menu.name = this.form.value.name;
    this.menu.image = this.form.value.image;
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



    this.menuService.update(this.menu)
      .subscribe(res => {
        this.menu = res.data;
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

