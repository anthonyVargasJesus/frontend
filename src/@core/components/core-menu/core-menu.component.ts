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




}
