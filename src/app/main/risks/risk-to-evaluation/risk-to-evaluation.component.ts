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
import { EditRiskAssessmentByRiskComponent } from '../risk-assessment-by-risk/edit-risk-assessment-by-risk/edit-risk-assessment-by-risk.component';
import { RiskAssessmentService } from 'app/services/risk-assessment.service';
import { AddRiskTreatmentByRiskComponent } from '../risk-treatment-by-risk/add-risk-treatment-by-risk/add-risk-treatment-by-risk.component';


@Component({
  selector: 'app-risk-to-evaluation',
  templateUrl: './risk-to-evaluation.component.html',
  styleUrls: ['./risk-to-evaluation.component.scss']
})


export class RiskToEvaluationComponent implements OnInit {


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

  @Input()
  evaluationId: number;
  coreConfig: any;

  IN_EVALUATION_STATUS_ID = 2

  constructor(private riskService: RiskService, private router: Router, private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog,
    private riskAssessmentService: RiskAssessmentService
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
      headerTitle: 'Riesgos en evaluación',
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
            name: 'En evaluación',
            isLink: false
          }
        ]
      }
    }
  }

  get() {
    this.loading = true;
    this.riskService.getByevaluationId(this.skip, this.pageSize,
      this.IN_EVALUATION_STATUS_ID, this.searchText)
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
    this.router.navigate(['/risks/add-risk', this.evaluationId]);
  }

  edit(risk: Risk) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditRiskAssessmentByRiskComponent, {
        height: '650px',
        width: '700px',
        data: {
          riskAssessmentId: risk.riskAssessmentId,
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


delete(risk: Risk) {

    let text: string;
      text = '¿Está seguro de eliminar el registro ' + risk.name + '?';

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

        this.riskAssessmentService.delete(risk.riskAssessmentId)
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
    this.risks = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

   initTreatment(risk: Risk) {
 
     if (this.loginService.isAuthenticated()) {
       let dialogRef = this.dialog.open(AddRiskTreatmentByRiskComponent, {
         height: '650px',
         width: '700px',
         data: {
           riskId: risk.riskId,
           //riskAssessmentId: risk.riskAssessmentId,
           valuationCID: risk.valuationCID,
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
