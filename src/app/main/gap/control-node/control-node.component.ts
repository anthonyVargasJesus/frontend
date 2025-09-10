import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Control } from 'app/models/control';
import { Subject } from 'rxjs';
import { ControlService } from 'app/services/control.service';
import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-control-node',
  templateUrl: './control-node.component.html',
  styles: [
  ]
})


export class ControlNodeComponent implements OnInit {

  controls: Control[] = [];
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
  controlGroupId: number;

  @Input()
  controlGroupNumber: number = 0;

  @Input()
  standardId: number;

  @Output() selectEvent = new EventEmitter();

  constructor(
    private controlService: ControlService,
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
      headerTitle: 'Normas',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Configuración',
            isLink: false,
            link: '#'
          },
          {
            name: 'Normas',
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
    this.controlService.get(this.skip, this.pageSize, this.searchText, this.controlGroupId)
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



  }


  edit(id: number) {

  }


  delete(control: Control) {

  }


  onKeydown(event, text: string) {

    this.searchText = text;
    if (event.key === 'Enter')
      this.search(this.searchText);

  }

  asignObjects(res) {
    this.controls = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  select(control: Control) {
    control.numerationToShow = this.controlGroupNumber + "." + control.number;
    this.selectEvent.emit(control);
  }

}
