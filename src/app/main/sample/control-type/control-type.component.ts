import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { getResults, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlType } from 'app/models/control-type';
import { ControlTypeService } from 'app/services/control-type.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from 'app/models/interfaces/core-config.interface'; // Asegúrate de tener esta interfaz

import { EditControlTypeComponent } from './edit-control-type/edit-control-type.component';
import { AddControlTypeComponent } from './add-control-type/add-control-type.component';

@Component({
  selector: 'app-control-type',
  templateUrl: './control-type.component.html',
  styles: []
})
export class ControlTypeComponent implements OnInit, OnDestroy {

  controlTypes: ControlType[] = [];
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
    private controlTypeService: ControlTypeService, 
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
      .config // Usando el observable directo si está disponible, o getConfig()
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
      headerTitle: 'Tipos de control',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'CATÁLOGOS', isLink: false, link: '#' },
          { name: 'Tipos de control', isLink: false }
        ]
      }
    };
  }

  get() {
    this.loading = true;
    this.controlTypeService.get(this.skip, this.pageSize, this.searchText)
      .pipe(takeUntil(this._unsubscribeAll)) // Añadido para seguridad
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

  changePageSize(value: number) {
    this.pageSize = value;
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
      const dialogRef = this.dialog.open(AddControlTypeComponent, {
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
      const dialogRef = this.dialog.open(EditControlTypeComponent, {
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

  delete(controlType: ControlType) {
    const text = `¿Esta seguro de eliminar el tipo de control ${controlType.name}?`;

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
        this.controlTypeService.delete(controlType.controlTypeId!)
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
    this.controlTypes = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }
}