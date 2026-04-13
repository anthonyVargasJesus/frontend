import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { getResults, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ConfidentialityLevel } from 'app/models/confidentiality-level';
import { ConfidentialityLevelService } from 'app/services/confidentialityLevel.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from 'app/models/interfaces/core-config.interface';

import { AddConfidentialityLevelComponent } from './add-confidentiality-level/add-confidentiality-level.component';
import { EditConfidentialityLevelComponent } from './edit-confidentiality-level/edit-confidentiality-level.component';

@Component({
  selector: 'app-confidentiality-level',
  templateUrl: './confidentiality-level.component.html',
  styles: []
})
export class ConfidentialityLevelComponent implements OnInit, OnDestroy {

  confidentialityLevels: ConfidentialityLevel[] = [];
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
    private confidentialityLevelService: ConfidentialityLevelService,
    private router: Router,
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
      headerTitle: 'Niveles de confidencialidad',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'DOCUMENTACIÓN', isLink: false, link: '#' },
          { name: 'Niveles de confidencialidad', isLink: false }
        ]
      }
    };
  }

  get() {
    this.loading = true;
    this.confidentialityLevelService.get(this.skip, this.pageSize, this.searchText)
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

  search(text: string) {
    this.searchText = text;
    this.skip = 0;
    this.get();
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
    const dialogRef = this.dialog.open(AddConfidentialityLevelComponent, {
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

  edit(id: string) {
    if (this.loginService.isAuthenticated()) {
      const dialogRef = this.dialog.open(EditConfidentialityLevelComponent, {
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

  delete(confidentialityLevel: ConfidentialityLevel) {
    const text = `¿Está seguro de eliminar el nivel de confidencialidad "${confidentialityLevel.name}"?`;

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
        this.confidentialityLevelService.delete(confidentialityLevel.confidentialityLevelId!.toString())
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: () => this.get(),
            error: (err) => ErrorManager.handleError(err)
          });
      }
    });
  }

  onKeydown(event: KeyboardEvent, text: string) {
    this.searchText = text;
    if (event.key === 'Enter') {
      this.search(this.searchText);
    }
  }

  asignObjects(res: any) {
    this.confidentialityLevels = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }
}