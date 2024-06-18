import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OptionInMenu } from 'app/models/option-in-menu';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionInMenuService } from 'app/services/option-in-menu.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuService } from 'app/services/menu.service';
import { Menu } from 'app/models/menu';
import { OptionService } from 'app/services/option.service';
import { Option } from 'app/models/option';
import { DialogData } from 'app/models/dialog-data'; 


@Component({
  selector: 'app-edit-option-in-menu-by-menu',
  templateUrl: './edit-option-in-menu-by-menu.component.html',
  styles: [
  ]
})
export class EditOptionInMenuByMenuComponent implements OnInit {

  constructor(
    private optionInMenuService: OptionInMenuService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private menuService: MenuService,
    private optionService: OptionService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private dialogRef: MatDialogRef<EditOptionInMenuByMenuComponent>,

  ) { }

  menus: Menu[] = [];
  options: Option[] = [];

  optionInMenu: OptionInMenu;
  loading = false;
  id: string;
  loading2 = false; 
  public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  ngOnInit(): void {
    this.initForm();
    this.getAllMenus();
    this.getAllOptions();
    this.initOptionInMenu();
    this.id = this.data['_id'];
    this.obtain(this.id);
  }


  initOptionInMenu() {
    this.optionInMenu = new OptionInMenu();
    this.initMenu();
    this.initOption();
  }
  initMenu() {
    if (this.menus.length > 0)
      this.optionInMenu.menu = this.menus[0];
  }

  initOption() {
    if (this.options.length > 0)
      this.optionInMenu.option = this.options[0];
  }


  initForm() {
    this.form = this._formBuilder.group({
      menu: ['', [Validators.required,]],
      option: ['', [Validators.required,]],
      order: ['', [Validators.required, Validators.maxLength(8),]],
    });
  }

  obtain(id: string) {
    this.loading = true;
    this.optionInMenuService.obtain(id)
      .subscribe((res: any) => {
        this.optionInMenu = res.data;
        this.setFormValue(this.optionInMenu);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(optionInMenu: OptionInMenu) {
    this.form.setValue({
      menu: ((optionInMenu.menuId == null) ? '' : optionInMenu.menuId),
      option: ((optionInMenu.optionId == null) ? '' : optionInMenu.optionId),
      order: ((optionInMenu.order == null) ? '' : optionInMenu.order),
    });
  }


  getFormValue() {
    this.optionInMenu.optionInMenuId = Number(this.id);
    this.optionInMenu.menuId = this.form.value.menu;
    this.optionInMenu.optionId = this.form.value.option;
    this.optionInMenu.order = this.form.value.order;
  }

  getAllMenus() {
    this.menuService.getAll()
      .subscribe((res: any) => {
        this.menus = res.data;
        this.initOptionInMenu();
      }, error => {
        ErrorManager.handleError(error);
      });
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();

    this.optionInMenuService.update(this.optionInMenu)
      .subscribe(res => {
        this.optionInMenu = res.data;
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

