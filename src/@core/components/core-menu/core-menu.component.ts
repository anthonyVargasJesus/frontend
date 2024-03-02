import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { UserService } from 'app/services/user.service';
import { Menu } from 'app/models/menu';
import { ErrorManager } from 'app/errors/error-manager';
import { mapperVuexyToCustom } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { LoginModel } from 'app/models/login-model';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;
  currentLoginModel: LoginModel = new LoginModel();
  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService,
    private _userService: UserService, private _loginService: LoginService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    // this.menu = this.menu || this._coreMenuService.getCurrentMenu();

    this.menu = [];

    this.currentLoginModel = this._loginService.getCurrentUser();

    let vuexyMenus = [];

    this._userService.getMenus(this.currentLoginModel._id)
      .subscribe((res: any) => {
        let menus = [];
        menus = res.data;

        vuexyMenus = [];
        menus.forEach(menu => {
          vuexyMenus.push(mapperVuexyToCustom(menu));
        });


        this.menu = vuexyMenus;
        this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
          this.currentUser = this._coreMenuService.currentUser;
          this._changeDetectorRef.markForCheck();
        });
      }, error => {
        ErrorManager.handleError(error);
      });


    // Subscribe to the current menu changes

  }


  createFakeMenus() {

    let vuexyMenus = [];



    let child11 = {
      id: 'child1',
      title: 'Mantenimiento',
      translate: 'Mantenimiento',
      type: 'item',
      icon: 'circle',
      url: 'evaluation-admin'
    };

    let child22 = {
      id: 'child2',
      title: 'Proceso',
      translate: 'Proceso',
      type: 'item',
      icon: 'circle',
      url: 'evaluation-process-list'
    };

    // let menuVuexy = {
    //   icon: 'archive',
    //   id: '1',
    //   title: 'NORMAS ISO',
    //   translate: "MENU.SECURITY",
    //   type: "collapsible",
    //   children: children
    // }




    // vuexyMenus.push(menuVuexy);

    let child1 = {
      id: 'child1',
      title: 'Normas',
      translate: 'Normas',
      type: 'item',
      icon: 'circle',
      url: 'standard'
    };

    let child2 = {
      id: 'child2',
      title: 'Niveles de Madurez',
      translate: 'Niveles de Madurez',
      type: 'item',
      icon: 'circle',
      url: 'maturity-level'
    };

    let child3 = {
      id: 'child3',
      title: 'Indicadores',
      translate: 'Indicadores',
      type: 'item',
      icon: 'circle',
      url: 'indicator'
    };

    let children = [];
    children.push(child1);
    children.push(child2);
    children.push(child3);


    let children2 = [];
    children2.push(child11);
    children2.push(child22);

    let menuVuexy2 = {
      icon: 'home',
      id: '1',
      title: 'EVALUACIONES',
      translate: "MENU.SECURITY",
      type: "collapsible",
      children: children2
    }

    let menuVuexy3 = {
      icon: 'settings',
      id: '1',
      title: 'CONFIGURACIÓN',
      translate: "MENU.SECURITY",
      type: "collapsible",
      children: children
    }

    vuexyMenus.push(menuVuexy2);
    vuexyMenus.push(menuVuexy3);

    this.menu = vuexyMenus;
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._coreMenuService.currentUser;
      this._changeDetectorRef.markForCheck();
    });

  }

}
