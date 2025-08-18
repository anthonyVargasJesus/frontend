import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreConfigService } from '@core/services/config.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Menu } from 'app/models/menu';
import { MenuInRole } from 'app/models/menu-in-role';
import { Option } from 'app/models/option';
import { OptionInMenuInRole } from 'app/models/option-in-menu-in-role';
import { Role } from 'app/models/role';
import { LoginService } from 'app/services/login.service';
import { MenuInRoleService } from 'app/services/menu-in-role.service';
import { MenuService } from 'app/services/menu.service';
import { OptionInMenuInRoleService } from 'app/services/option-in-menu-in-role.service';
import { RoleService } from 'app/services/role.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-menu-in-role',
  templateUrl: './menu-in-role.component.html',
  styles: [
  ]
})
export class MenuInRoleComponent implements OnInit {


  menuInRoles: MenuInRole[] = [];
  loading = false;
  loading2 = false;
  searchText: string = '';
  results: string;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  @Input()
  roleId: string;
  menus: Menu[] = [];

  constructor(
    private menuInRoleService: MenuInRoleService,
    private menuService: MenuService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private optionInMenuInRoleService: OptionInMenuInRoleService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getTheme();
    this.getMenus();
  }

  getTheme() {
    this._unsubscribeAll = new Subject();
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.currentSkin = config.layout.skin;
        this.setDialogContainerStyle();
      });
  }

  setDialogContainerStyle() {
    if (this.currentSkin == 'dark')
      this.panelClass = 'custom-dark-dialog-container';
    else
      this.panelClass = 'custom-default-dialog-container';
  }

  getMenus() {
    this.loading = true;
    this.menuService.getByRoleId(Number(this.roleId))
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  asignObjects(res) {
    this.menus = res.data;
  }

  fieldsChange(values: any, menu: Menu, option: Option) {

    let isChecked = values.currentTarget.checked;
    if (isChecked) {
      //option.loading = true;
      let role = new Role();
      role.roleId = Number(this.roleId);

      let body = {
        roleId: role.roleId,
        menuId: menu.menuId,
        optionId: option.optionId,
        order: option.order,
      }
      this.insert(body, option);
    
    } else{

      this.delete(option);
      
    }
  }

  async insert(body: any, option: Option) {
    option.loading = true;
    //await new Promise(f => setTimeout(f, 1000));
    this.optionInMenuInRoleService.insert(body)
      .subscribe(res => {
     
        option.loading = false;
        this.getMenus();
      }, error => {
        option.loading = false;
        ErrorManager.handleError(error);
      });
  }

  async delete(option: Option) {
    option.loading = true;
    //await new Promise(f => setTimeout(f, 1000));
    option.loading = true;
    this.optionInMenuInRoleService.delete(option.optionInMenuInRoleId.toString())
      .subscribe(res => {
     
        option.loading = false;
        this.getMenus();
      }, error => {
        option.loading = false;
        ErrorManager.handleError(error);
      });
  }

}
