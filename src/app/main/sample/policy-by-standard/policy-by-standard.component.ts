import { Component, Input, OnInit } from '@angular/core';

import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Policy } from 'app/models/policy';
import { PolicyService } from 'app/services/policy.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AddPolicyByStandardComponent } from './add-policy-by-standard/add-policy-by-standard.component';
import { MatDialog } from '@angular/material/dialog';
import { EditPolicyComponent } from '../policy/edit-policy/edit-policy.component';
import { StandardService } from 'app/services/standard.service';
import { Standard } from 'app/models/standard';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-policy-by-standard',
  templateUrl: './policy-by-standard.component.html',
  styles: [
  ]
})
export class PolicyByStandardComponent implements OnInit {


  policies: Policy[] = [];
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
  standard: Standard = new Standard();

  constructor(private policyService: PolicyService, private loginService: LoginService,
    private _coreConfigService: CoreConfigService, private standardService: StandardService,
    private dialog: MatDialog, private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.getTheme();
    this.pageSize = PAGE_SIZE;

    if (this.standardId == undefined) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.standardId = Number(params.get('id').toString());
        this.get();
      });
    }

    this.obtainStandard(this.standardId);
  }

  obtainStandard(id: number) {
    this.loading = true;
    this.standardService.obtain(id.toString())
      .subscribe((res: any) => {
        this.standard = res.data;
        this.loading = false;
        this.initMenuName();
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

    let title = '';
    if (this.standard)
      title = this.standard.name;

    this.contentHeader = {
      headerTitle: 'Política',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: title,
            isLink: false,
            link: '#'
          },
          {
            name: 'Política',
            isLink: false
          },
        ]
      }
    }
  }

  get() {
    this.loading = true;
    this.policyService.getBystandardId(this.skip, this.pageSize, this.standardId, this.searchText)
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
      let dialogRef = this.dialog.open(AddPolicyByStandardComponent, {
        height: '550px',
        width: '550px',
        autoFocus: false, data: { standardId: this.standardId }, panelClass: this.panelClass
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
      let dialogRef = this.dialog.open(EditPolicyComponent, {
        height: '550px',
        width: '550px',
        data: {
          _id: id, standardId: this.standardId,
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

  delete(policy: Policy) {

    let text: string;
    text = '¿Está seguro de eliminar el registro ' + policy.name + '?';

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

        this.policyService.delete(policy.policyId)
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
    this.policies = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}  //{
//path: 'policy',
//component: PolicyComponent,
//data: { animation: 'policy' }
//},

//PolicyComponent, AddPolicyComponent, EditPolicyComponent
//{
//id: 'policy',
//title: '',
//translate: 'MENU.POLICY',
//type: 'item',
//icon: 'file',
//url: 'policy'
//},

//   POLICY: 'Policy'


