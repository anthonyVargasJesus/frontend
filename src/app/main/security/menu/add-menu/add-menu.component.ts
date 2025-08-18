import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { Menu } from 'app/models/menu';
import { ErrorManager } from 'app/errors/error-manager';
import { MenuService } from 'app/services/menu.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styles: [
  ]
})


export class AddMenuComponent implements OnInit {

  constructor(
    private menuService: MenuService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddMenuComponent>,

  ) { }


  menu: Menu;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;


  ngOnInit(): void {
    this.initForm();

    this.initMenu();

  }

  initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200),]],
      image: ['', [Validators.maxLength(200),]],
    });
  }

  initMenu() {
    this.menu = new Menu();
  }




  getFormValue() {
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



    this.menuService.insert(this.menu)
      .subscribe(res => {
        this.menu = res.data;
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

