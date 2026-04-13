import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { getResults, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Personal } from 'app/models/personal';
import { PersonalService } from 'app/services/personal.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from 'app/models/interfaces/core-config.interface';

import { EditPersonalComponent } from './edit-personal/edit-personal.component';
import { AddPersonalComponent } from './add-personal/add-personal.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styles: []
})
export class PersonalComponent implements OnInit, OnDestroy {

  personals: Personal[] = [];
  selectedRow = 0;
  page = 1;
  skip = 0;
  pageSize: number = PAGE_SIZE;
  total = 0;
  totalPages = 0;
  loading = false;
  searchText: string = '';
  results: string = '';
  previous = true;
  next = true;

  public contentHeader!: object;
  public currentSkin: string = 'default';
  private _unsubscribeAll: Subject<void>;
  private panelClass: string = '';

  constructor(
    private personalService: PersonalService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.getTheme();
    this.initMenuName();
    this.pageSize = PAGE_SIZE;
    this.get();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getTheme() {
    this._coreConfigService
      .config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: CoreConfig) => {
        this.currentSkin = config.layout.skin;
        this.setDialogContainerStyle();
      });
  }

  setDialogContainerStyle() {
    this.panelClass = this.currentSkin === 'dark' 
      ? 'custom-dark-dialog-container' 
      : 'custom-default-dialog-container';
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Personal',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'CATÁLOGOS', isLink: false, link: '#' },
          { name: 'Personal', isLink: false }
        ]
      }
    };
  }

  get() {
    this.loading = true;
    this.personalService.get(this.skip, this.pageSize, this.searchText)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: any) => {
          this.asignObjects(res);
          this.page = (this.skip / this.pageSize) + 1;
          this.results = getResults(this.total, this.totalPages);
          this.loading = false;
          this.disabledPagination();
        },
        error: (error) => {
          this.loading = false;
          ErrorManager.handleError(error);
        }
      });
  }

  changePageSize(value: number) {
    this.pageSize = value;
    this.skip = 0;
    this.get();
  }

  changePage(value: number) {
    const desde = this.skip + value;
    if (desde >= this.total || desde < 0) return;

    this.skip += value;
    this.get();
  }

  disabledPagination() {
    this.previous = this.page <= 1;
    this.next = this.page >= this.totalPages;
  }

  add() {
    if (this.loginService.isAuthenticated()) {
      const dialogRef = this.dialog.open(AddPersonalComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false, 
        panelClass: this.panelClass
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
          if (data?.updated) this.get();
        });
    }
  }

  edit(id: string) {
    if (this.loginService.isAuthenticated()) {
      const dialogRef = this.dialog.open(EditPersonalComponent, {
        height: '600px',
        width: '600px',
        data: { _id: id },
        autoFocus: false,
        panelClass: this.panelClass
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
          if (data?.updated) this.get();
        });
    }
  }

  delete(personal: Personal) {
    const text = `¿Esta seguro de eliminar el registro de ${personal.name}?`;

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
        this.personalService.delete(personal.personalId!)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.get();
          });
      }
    });
  }

  search(text: string) {
    this.searchText = text;
    this.skip = 0;
    this.get();
  }

  onKeydown(event: KeyboardEvent, text: string) {
    this.searchText = text;
    if (event.key === 'Enter') {
      this.search(this.searchText);
    }
  }

  asignObjects(res: any) {
    this.personals = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }
}