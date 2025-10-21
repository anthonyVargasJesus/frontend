import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { getResults, PAGE_SIZE } from 'app/config/config';
import { ErrorManager } from 'app/errors/error-manager';
import { Breach } from 'app/models/breach';
import { Risk } from 'app/models/risk';
import { BreachService } from 'app/services/breach.service';
import { LoginService } from 'app/services/login.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AddRiskByEvaluationComponent } from '../risk-by-evaluation/add-risk-by-evaluation/add-risk-by-evaluation.component';
import { Evaluation } from 'app/models/evaluation';

@Component({
  selector: 'app-risks-identification',
  templateUrl: './risks-identification.component.html',
  styleUrls: ['./risks-identification.component.scss']
})
export class RisksIdentificationComponent implements OnInit {

  breachs: Breach[] = [];
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
  currentEvaluation: Evaluation = new Evaluation();

  constructor(private breachService: BreachService, private loginService: LoginService,
    private _coreConfigService: CoreConfigService, private router: Router,
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
      headerTitle: 'Indentificación de riesgos',
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
            name: 'Identificación',
            isLink: false
          }
        ]
      }
    }
  }

  get() {
    this.loading = true;
    this.breachService.getRisksIdentification(this.skip, this.pageSize, this.searchText)
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.currentEvaluation = res.currentEvaluation;
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

  edit(id: String) {


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
    this.breachs = res.breachs;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  createRisk(defaultRisk: Risk, breachId: number) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddRiskByEvaluationComponent, {
        height: '620px',
        width: '600px',
        data: {
          evaluationId: this.currentEvaluation.evaluationId,
          breachId: breachId,
          defaultRisk: defaultRisk,
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
