import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';
import { EditSupportForControlComponent } from './edit-support-for-control/edit-support-for-control.component';
import { AddSupportForControlComponent } from './add-support-for-control/add-support-for-control.component';
import { SupportForControl } from 'app/models/support-for-control';
import { SupportForControlService } from 'app/services/support-for-control.service';


@Component({
  selector: 'app-support-for-control',
  templateUrl: './support-for-control.component.html',
  styles: [
  ]
})
export class SupportForControlComponent implements OnInit {

  supportForControls: SupportForControl[] = [];
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
  documentationId: number;

  @Input()
  standardId: number;


  constructor(
    private supportForControlService: SupportForControlService,
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
      headerTitle: 'Sutentos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Documentación',
            isLink: false,
            link: '#'
          },
          {
            name: 'Sutentos',
            isLink: false
          },
          {
            name: 'ISO 27001',
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
    this.supportForControlService.get(this.skip, this.pageSize, this.searchText, this.documentationId)
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
      let dialogRef = this.dialog.open(AddSupportForControlComponent, {
        height: '600px',
        width: '600px',
        data: {
          standardId: this.standardId,
          documentationId: this.documentationId,
        },
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

  edit(id: number) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditSupportForControlComponent, {
        height: '600px',
        width: '600px',
        data: {
          _id: id,
          standardId: this.standardId,
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



  delete(supportForControl: SupportForControl) {

    let text: string;
    text = '¿Esta seguro de eliminar el requisito: ' + supportForControl.control.name + '?';

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

        this.supportForControlService.delete(supportForControl.supportForControlId.toString())
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
    this.supportForControls = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

}
