import { Component, Input, OnInit } from '@angular/core';

import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { RoleInUser } from 'app/models/role-in-user';
import { RoleInUserService } from 'app/services/role-in-user.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditRoleInUserByUserComponent } from './edit-role-in-user-by-user/edit-role-in-user-by-user.component';
import { AddRoleInUserByUserComponent } from './add-role-in-user-by-user/add-role-in-user-by-user.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-role-in-user-by-user',
  templateUrl: './role-in-user-by-user.component.html',
  styles: [
  ]
})
export class RoleInUserByUserComponent implements OnInit {


  roleInUsers: RoleInUser[] = [];
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
  userId: number;


  constructor(private roleInUserService: RoleInUserService, private loginService: LoginService,
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
      headerTitle: 'RoleInUser',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'RoleInUser',
            isLink: false,
            link: '#'
          },
          {
            name: 'RoleInUser',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.roleInUserService.getByuserId(this.skip, this.pageSize, this.userId, this.searchText)
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
      let dialogRef = this.dialog.open(AddRoleInUserByUserComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false, data: { userId: this.userId }, panelClass: this.panelClass
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
      let dialogRef = this.dialog.open(EditRoleInUserByUserComponent, {
        height: '600px',
        width: '600px',
        data: {
          _id: id, userId: this.userId,
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

  delete(roleInUser: RoleInUser) {

    let text: string;
    text = '¿Esta seguro de eliminar la roleInUser ' + roleInUser.role.name + '?';

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

        this.roleInUserService.delete(roleInUser.roleInUserId)
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
    this.roleInUsers = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}  //{
//path: 'role-in-user',
//component: RoleInUserComponent,
//data: { animation: 'role-in-user' }
//},

//RoleInUserComponent, AddRoleInUserComponent, EditRoleInUserComponent
//{
//id: 'roleInUser',
//title: '',
//translate: 'MENU.ROLEINUSER',
//type: 'item',
//icon: 'file',
//url: 'roleInUser'
//},

//   ROLEINUSER: 'RoleInUser'


