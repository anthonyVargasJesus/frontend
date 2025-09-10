import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { getResults, PAGE_SIZE } from 'app/config/config';
import { ErrorManager } from 'app/errors/error-manager';
import { Control } from 'app/models/control';
import { ControlGroup } from 'app/models/control-group';
import { DialogData } from 'app/models/dialog-data';
import { LoginModel } from 'app/models/login-model';
import { ControlGroupService } from 'app/services/control-group.service';
import { LoginService } from 'app/services/login.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-popup-controls',
  templateUrl: './popup-controls.component.html',
  styles: [
  ]
})
export class PopupControlsComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;


  controlGroups: ControlGroup[] = [];
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
  standardId: number;

  currentLoginModel: LoginModel = new LoginModel();
  coreConfig: any;

  constructor(
    private controlGroupService: ControlGroupService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialogRef: MatDialogRef<PopupControlsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) {
    this._unsubscribeAll = new Subject();
  }


  ngOnInit() {

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.currentLoginModel = this.loginService.getCurrentUser();

    this.getTheme();
    this.initMenuName();
    this.pageSize = PAGE_SIZE;
    this.standardId = this.data['standardId'];
    this.get();
  }

  expandAll() {
    this.accordion.openAll();
  }

  collapseAll() {
    this.accordion.closeAll();
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
      headerTitle: 'Controles',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.currentLoginModel.cs,
            isLink: false,
            link: '#'
          },
          {
            name: 'Controles',
            isLink: false
          },
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
    this.controlGroupService.get(this.skip, this.pageSize, this.searchText, this.standardId)
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



  delete(controlGroup: ControlGroup) {



  }


  onKeydown(event, text: string) {

    this.searchText = text;
    if (event.key === 'Enter')
      this.search(this.searchText);

  }

  asignObjects(res) {
    this.controlGroups = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  addControlFromGroup(controlGroupId: number) {

  }

  close() {
    this.dialogRef.close();
  }

  select(control: Control) {
    this.dialogRef.close({ control: control });
  }

}
