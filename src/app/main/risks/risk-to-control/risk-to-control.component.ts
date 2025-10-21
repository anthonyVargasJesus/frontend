import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getResults, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Risk } from 'app/models/risk';
import { RiskService } from 'app/services/risk.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { RiskTreatmentService } from 'app/services/risk-treatment.service';
import { EditRiskTreatmentByRiskComponent } from '../risk-treatment-by-risk/edit-risk-treatment-by-risk/edit-risk-treatment-by-risk.component';
import { AddControlImplementationByRiskComponent } from '../control-implementation-by-risk/add-control-implementation-by-risk/add-control-implementation-by-risk.component';
import { AcceptRiskComponent } from '../accept-risk/accept-risk.component';
import { ScalateRiskComponent } from '../scalate-risk/scalate-risk.component';
import { ReopenRiskComponent } from '../reopen-risk/reopen-risk.component';


@Component({
  selector: 'app-risk-to-control',
  templateUrl: './risk-to-control.component.html',
  styleUrls: ['./risk-to-control.component.scss']
})
export class RiskToControlComponent implements OnInit {


  risks: Risk[] = [];
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


  coreConfig: any;


  constructor(private riskService: RiskService, private router: Router, private loginService: LoginService,
    private _coreConfigService: CoreConfigService, private riskTreatmentService: RiskTreatmentService,
    private dialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
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
      headerTitle: 'Seguimiento de riesgos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'RIESGOS',
            isLink: false,
            link: '#'
          },
          {
            name: 'Seguimiento',
            isLink: false
          }
        ]
      }
    }
  }

  get() {
    this.loading = true;
    this.riskService.getMonitoring(this.skip, this.pageSize, this.searchText)
      .subscribe((res: any) => {
        this.asignObjects(res);
        console.log(res);
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

  edit(risk: Risk) {

    
  }

  delete(risk: Risk) {

   
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
    this.risks = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  acceptRisk(risk: Risk) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AcceptRiskComponent, {
        height: '390px',
        width: '600px',
        data: {
          riskId: risk.riskId,
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

  escalateRisk(risk: Risk) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(ScalateRiskComponent, {
        height: '390px',
        width: '600px',
        data: {
          riskId: risk.riskId,
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

  reopenRisk(risk: Risk) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(ReopenRiskComponent, {
        height: '390px',
        width: '600px',
        data: {
          riskId: risk.riskId,
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

}
