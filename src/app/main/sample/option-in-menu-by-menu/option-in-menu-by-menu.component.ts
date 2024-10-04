import { Component, Input, OnInit } from '@angular/core';

import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { OptionInMenu } from 'app/models/option-in-menu';
import { OptionInMenuService } from 'app/services/option-in-menu.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditOptionInMenuByMenuComponent } from './edit-option-in-menu-by-menu/edit-option-in-menu-by-menu.component';
import { AddOptionInMenuByMenuComponent } from './add-option-in-menu-by-menu/add-option-in-menu-by-menu.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-option-in-menu-by-menu',
  templateUrl: './option-in-menu-by-menu.component.html',
  styles: [
  ]
})
export class OptionInMenuByMenuComponent implements OnInit {


  optionInMenus: OptionInMenu[] = [];
  selectedRow = 0;
  page = 1;
  skip = 0;
  pageSize;
  total = 0;
  totalPages = 0;
  loading = false;
  searchText: string = '';
  results: string;
  previous = true;
  next = true;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  @Input()
  menuId: number;


  constructor(private optionInMenuService: OptionInMenuService, private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getTheme();
    this.initMenuName();
    this.pageSize = PAGE_SIZE;
    this.get();
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




  initMenuName() {
    this.contentHeader = {
      headerTitle: 'OptionInMenu',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'OptionInMenu',
            isLink: false,
            link: '#'
          },
          {
            name: 'OptionInMenu',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.optionInMenuService.getBymenuId(this.skip, this.pageSize, this.menuId, this.searchText)
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.page = (this.skip / this.pageSize) + 1;
        this.results = getResults(this.total, this.totalPages);
        this.loading = false;
        this.disabledPagination();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  changePageSize(value) {
    this.pageSize = value;
    this.get();
  }

  changePage(value: number) {
    const desde = this.skip + value;
    if (desde >= this.total)
      return;

    if (desde < 0)
      return;

    this.skip += value;
    this.get();
  }

  disabledPagination() {

    this.previous = true;
    this.next = true;

    if (this.page > 1)
      this.previous = false;

    if (this.page < this.totalPages)
      this.next = false;
  }

  add() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddOptionInMenuByMenuComponent, {
        height: '450px',
        width: '450px',
        autoFocus: false, data: { menuId: this.menuId }, panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.get();
      });
    }

  }

  edit(id: String) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditOptionInMenuByMenuComponent, {
        height: '450px',
        width: '450px',
        data: {
          _id: id, menuId: this.menuId,
        },
        autoFocus: false,
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.get();
      });
    }
  }

  delete(optionInMenu: OptionInMenu) {

    let text: string;
    text = '¿Esta seguro de eliminar la optionInMenu ' + optionInMenu.option.name + '?';

    Swal.fire({
      title: 'Confirmación',
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        this.optionInMenuService.delete(optionInMenu.optionInMenuId)
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }

  search(text: string) {
    this.searchText = text;
    this.skip = 0;
    this.get();
  }

  onKeydown(event, text: string) {
    this.searchText = text;
    if (event.key === 'Enter')
      this.search(this.searchText);
  }

  asignObjects(res) {
    this.optionInMenus = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}

