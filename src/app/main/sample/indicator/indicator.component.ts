import { Component, OnInit } from '@angular/core';
import { EditIndicatorComponent } from './edit-indicator/edit-indicator.component';
import { AddIndicatorComponent } from './add-indicator/add-indicator.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Indicator } from 'app/models/indicator';
import { Subject } from 'rxjs';
import { IndicatorService } from 'app/services/indicator.service';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styles: [
  ]
})
export class IndicatorComponent implements OnInit {


  indicators: Indicator[] = [];
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


  constructor(
    private indicatorService: IndicatorService,
    private router: Router,
    private loginService: LoginService,
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
      headerTitle: 'Indicadores',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONFIGURACIÓN',
            isLink: false,
            link: '#'
          },
          {
            name: 'Indicadores',
            isLink: false
          }
        ]
      }
    }
  }



  search(text: string) {
    this.searchText = text;
    this.skip = 0;

    this.get();
  }

  get() {

    this.loading = true;
    this.indicatorService.get(this.skip, this.pageSize, this.searchText)
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

    //if (this.loginService.isAuthenticated()) {
    let dialogRef = this.dialog.open(AddIndicatorComponent, {
      height: '600px',
      width: '600px',
      autoFocus: false, panelClass: this.panelClass
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

      if (data.updated == true)
        this.get();
    });
    //}

  }

  edit(id: String) {

    if (this.loginService.isAuthenticated()) {
    let dialogRef = this.dialog.open(EditIndicatorComponent, {
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

  delete(indicator: Indicator) {

    let text: string;
    text = '¿Esta seguro de eliminar el indicador ' + indicator.name + '?';

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

        this.indicatorService.delete(indicator.indicatorId.toString())
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }


  onKeydown(event, text: string) {

    this.searchText = text;
    if (event.key === 'Enter')
      this.search(this.searchText);

  }

  asignObjects(res) {
    this.indicators = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }



}
