import { Component, Inject, Input, OnInit } from '@angular/core';
import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlImplementation } from 'app/models/control-implementation';
import { ControlImplementationService } from 'app/services/control-implementation.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditControlImplementationByRiskComponent } from './edit-control-implementation-by-risk/edit-control-implementation-by-risk.component';
import { AddControlImplementationByRiskComponent } from './add-control-implementation-by-risk/add-control-implementation-by-risk.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'app/models/dialog-data';
import { Risk } from 'app/models/risk';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RiskService } from 'app/services/risk.service';


@Component({
  selector: 'app-control-implementation-by-risk',
  templateUrl: './control-implementation-by-risk.component.html',
  styleUrls: ['./control-implementation-by-risk.component.scss']
})


export class ControlImplementationByRiskComponent implements OnInit {

  controlImplementations: ControlImplementation[] = [];
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

  selectedRisk: Risk = new Risk();
  riskId: number;

  constructor(private controlImplementationService: ControlImplementationService, private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog, private riskService: RiskService,
    private route: ActivatedRoute, private router: Router
  ) {

  }

  ngOnInit() {
    this.pageSize = PAGE_SIZE;
    this.getTheme();
    this.initMenuName();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.riskId = Number(params.get('id').toString());
      this.obtainRisk();
    });
  }

  obtainRisk() {
    this.loading = true;
    this.riskService.obtain(this.riskId.toString())
      .subscribe((res: any) => {
        this.selectedRisk = res.data;
        this.loading = false;
        this.get();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
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
      headerTitle: 'Controles aplicados',
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
            name: 'En tratamiento',
            isLink: false
          }
        ]
      }
    }
  }

  get() {
    this.loading = true;
    this.controlImplementationService.getByriskId(this.skip, this.pageSize, this.riskId, this.searchText)
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
      let dialogRef = this.dialog.open(AddControlImplementationByRiskComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false, data: {
          riskId: this.riskId
        }, panelClass: this.panelClass
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
      let dialogRef = this.dialog.open(EditControlImplementationByRiskComponent, {
        height: '600px',
        width: '600px',
        data: {
          controlImplementationId: id, riskId: this.riskId,
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

  delete(controlImplementation: ControlImplementation) {

    let text: string;
    text = '¿Está seguro de eliminar el registro ' + controlImplementation.activities + '?';

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

        this.controlImplementationService.delete(controlImplementation.controlImplementationId)
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
    this.controlImplementations = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  navigateToBack() {
    this.router.navigate(['/risks/risk-to-treatment']);
  }


}
