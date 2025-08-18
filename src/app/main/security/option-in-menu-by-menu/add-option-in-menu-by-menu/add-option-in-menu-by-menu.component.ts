import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { OptionInMenu } from 'app/models/option-in-menu';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionInMenuService } from 'app/services/option-in-menu.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OptionService } from 'app/services/option.service';
import { Option } from 'app/models/option';

import { Menu } from 'app/models/menu';
import { DialogData } from 'app/models/dialog-data';


@Component({
  selector: 'app-add-option-in-menu-by-menu',
  templateUrl: './add-option-in-menu-by-menu.component.html',
  styles: [
  ]
})


export class AddOptionInMenuByMenuComponent implements OnInit {

  constructor(
    private optionInMenuService: OptionInMenuService,

    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddOptionInMenuByMenuComponent>, private optionService: OptionService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,

  ) { }

  options: Option[] = [];

  optionInMenu: OptionInMenu;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  menuId: string;

  ngOnInit(): void {
    this.initForm();
    this.getAllOptions();
    this.menuId = this.data['menuId'];
    this.initOptionInMenu();
  }

  initForm() {
    this.form = this._formBuilder.group({
      option: ['', [Validators.required,]],
      order: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  initOptionInMenu() {
    this.optionInMenu = new OptionInMenu();
  }



  getAllOptions() {
    this.optionService.getAll()
      .subscribe((res: any) => {
        this.options = res.data;
        this.initOptionInMenu();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getFormValue() {
    this.optionInMenu.optionId = this.form.value.option;
    this.optionInMenu.order = this.form.value.order;
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

    this.optionInMenu.menuId = Number(this.menuId);

    this.optionInMenuService.insert(this.optionInMenu)
      .subscribe(res => {
        this.optionInMenu = res.data;
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

