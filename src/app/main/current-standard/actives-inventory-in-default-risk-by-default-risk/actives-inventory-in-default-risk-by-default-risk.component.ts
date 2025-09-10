import { Component, Input, OnInit } from '@angular/core';

import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ActivesInventoryInDefaultRisk } from 'app/models/actives-inventory-in-default-risk';
import { ActivesInventoryInDefaultRiskService } from 'app/services/actives-inventory-in-default-risk.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditActivesInventoryInDefaultRiskByDefaultRiskComponent } from './edit-actives-inventory-in-default-risk-by-default-risk/edit-actives-inventory-in-default-risk-by-default-risk.component';
import { AddActivesInventoryInDefaultRiskByDefaultRiskComponent } from './add-actives-inventory-in-default-risk-by-default-risk/add-actives-inventory-in-default-risk-by-default-risk.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-actives-inventory-in-default-risk-by-default-risk',
  templateUrl: './actives-inventory-in-default-risk-by-default-risk.component.html',
  styles: [
  ]
})
export class ActivesInventoryInDefaultRiskByDefaultRiskComponent implements OnInit {


  activesInventoryInDefaultRisks: ActivesInventoryInDefaultRisk[] = [];
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
  defaultRiskId: number;


  constructor(private activesInventoryInDefaultRiskService: ActivesInventoryInDefaultRiskService, private loginService: LoginService,
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
      headerTitle: 'ActivesInventoryInDefaultRisk',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'ActivesInventoryInDefaultRisk',
            isLink: false,
            link: '#'
          },
          {
            name: 'ActivesInventoryInDefaultRisk',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.activesInventoryInDefaultRiskService.getBydefaultRiskId(this.skip, this.pageSize, this.defaultRiskId, this.searchText)
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
      let dialogRef = this.dialog.open(AddActivesInventoryInDefaultRiskByDefaultRiskComponent, {
        height: '450px',
        width: '500px',
        autoFocus: false, data: { defaultRiskId: this.defaultRiskId }, panelClass: this.panelClass
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
      let dialogRef = this.dialog.open(EditActivesInventoryInDefaultRiskByDefaultRiskComponent, {
        height: '450px',
        width: '500px',
        data: {
          _id: id, defaultRiskId: this.defaultRiskId,
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

  delete(activesInventoryInDefaultRisk: ActivesInventoryInDefaultRisk) {

    let text: string;
    text = '¿Está seguro de eliminar el registro ' + activesInventoryInDefaultRisk.activesInventory.name + '?';

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

        this.activesInventoryInDefaultRiskService.delete(activesInventoryInDefaultRisk.activesInventoryInDefaultRiskId)
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
    this.activesInventoryInDefaultRisks = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}  //{
//path: 'actives-inventory-in-default-risk',
//component: ActivesInventoryInDefaultRiskComponent,
//data: { animation: 'actives-inventory-in-default-risk' }
//},

//ActivesInventoryInDefaultRiskComponent, AddActivesInventoryInDefaultRiskComponent, EditActivesInventoryInDefaultRiskComponent
//{
//id: 'activesInventoryInDefaultRisk',
//title: '',
//translate: 'MENU.ACTIVESINVENTORYINDEFAULTRISK',
//type: 'item',
//icon: 'file',
//url: 'activesInventoryInDefaultRisk'
//},

//   ACTIVESINVENTORYINDEFAULTRISK: 'ActivesInventoryInDefaultRisk'


