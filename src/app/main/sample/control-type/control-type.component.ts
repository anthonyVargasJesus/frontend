import { Component, OnInit } from '@angular/core';
import { getResults, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlType } from 'app/models/control-type';
import { ControlTypeService } from 'app/services/control-type.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditControlTypeComponent } from './edit-control-type/edit-control-type.component';
import { AddControlTypeComponent } from './add-control-type/add-control-type.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-control-type',
  templateUrl: './control-type.component.html',
  styles: [
  ]
})
export class ControlTypeComponent implements OnInit {


  controlTypes: ControlType[] = [];
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


  constructor(private controlTypeService: ControlTypeService, private loginService: LoginService,
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
      headerTitle: 'ControlType',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'ControlType',
            isLink: false,
            link: '#'
          },
          {
            name: 'ControlType',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.controlTypeService.get(this.skip, this.pageSize, this.searchText)
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
      let dialogRef = this.dialog.open(AddControlTypeComponent, {
        height: '600px',
        width: '550px',
        autoFocus: false, panelClass: this.panelClass
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
      let dialogRef = this.dialog.open(EditControlTypeComponent, {
        height: '600px',
        width: '600px',
        data: {
          _id: id,
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

  delete(controlType: ControlType) {

    let text: string;
    text = '¿Esta seguro de eliminar la controlType ' + controlType.name + '?';

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

        this.controlTypeService.delete(controlType.controlTypeId)
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
    this.controlTypes = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}  //{
//path: 'control-type',
//component: ControlTypeComponent,
//data: { animation: 'control-type' }
//},

//ControlTypeComponent, AddControlTypeComponent, EditControlTypeComponent
//{
//id: 'controlType',
//title: '',
//translate: 'MENU.CONTROLTYPE',
//type: 'item',
//icon: 'file',
//url: 'controlType'
//},

//   CONTROLTYPE: 'ControlType'


