import { Component, Input, OnInit } from '@angular/core';
import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Scope } from 'app/models/scope';
import { ScopeService } from 'app/services/scope.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { EditScopeByStandardComponent } from './edit-scope-by-standard/edit-scope-by-standard.component';
import { AddScopeByStandardComponent } from './add-scope-by-standard/add-scope-by-standard.component';
import { MatDialog } from '@angular/material/dialog';
import { Standard } from 'app/models/standard';
import { StandardService } from 'app/services/standard.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-scope-by-standard',
  templateUrl: './scope-by-standard.component.html',
  styles: [
  ]
})
export class ScopeByStandardComponent implements OnInit {


  scopes: Scope[] = [];
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

  constructor(private scopeService: ScopeService, private loginService: LoginService,
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
      headerTitle: 'Alcance',
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
            name: 'Alcance',
            isLink: false
          },
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.scopeService.getBystandardId(this.skip, this.pageSize, this.standardId, this.searchText)
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
      let dialogRef = this.dialog.open(AddScopeByStandardComponent, {
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
      let dialogRef = this.dialog.open(EditScopeByStandardComponent, {
        height: '600px',
        width: '600px',
        data: {
          _id: id,
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

  delete(scope: Scope) {

    let text: string;
    text = '¿Está seguro de eliminar el registro ' + scope.name + '?';

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

        this.scopeService.delete(scope.scopeId)
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
    this.scopes = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}  //{
//path: 'scope',
//component: ScopeComponent,
//data: { animation: 'scope' }
//},

//ScopeComponent, AddScopeComponent, EditScopeComponent
//{
//id: 'scope',
//title: '',
//translate: 'MENU.SCOPE',
//type: 'item',
//icon: 'file',
//url: 'scope'
//},

//   SCOPE: 'Scope'


