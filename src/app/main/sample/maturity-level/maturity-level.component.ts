import { Component, OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { MaturityLevel } from 'app/models/maturity-level';
import { MaturityLevelService } from 'app/services/maturity-level.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditMaturityLevelComponent } from './edit-maturity-level/edit-maturity-level.component';
import { AddMaturityLevelComponent } from './add-maturity-level/add-maturity-level.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maturity-level',
  templateUrl: './maturity-level.component.html',
  styles: [
  ]
})

export class MaturityLevelComponent implements OnInit {


  maturityLevels: MaturityLevel[] = [];
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
    private maturityLevelService: MaturityLevelService,
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
      headerTitle: 'Niveles de madurez',
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
            name: 'Niveles de madurez',
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
    this.maturityLevelService.get(this.skip, this.pageSize, this.searchText)
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
    let dialogRef = this.dialog.open(AddMaturityLevelComponent, {
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

    //if (this.loginService.isAuthenticated()) {
    let dialogRef = this.dialog.open(EditMaturityLevelComponent, {
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
    //}
  }

  delete(maturityLevel: MaturityLevel) {

    let text: string;
    text = '¿Esta seguro de eliminar el nivel de madurez ' + maturityLevel.name + '?';

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

        this.maturityLevelService.delete(maturityLevel.maturityLevelId.toString())
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
    this.maturityLevels = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

}
