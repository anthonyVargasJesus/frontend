import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentationComponent } from './add-documentation/add-documentation.component';
import { EditDocumentationComponent } from './edit-documentation/edit-documentation.component';
import { Documentation } from 'app/models/documentation';
import { MatAccordion } from '@angular/material/expansion';
import { Subject } from 'rxjs';
import { DocumentationService } from 'app/services/documentation.service';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';
import { Standard } from 'app/models/standard';
import { StandardService } from 'app/services/standard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styles: [
  ]
})
export class DocumentationComponent implements OnInit {


  documentations: Documentation[] = [];
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

  constructor(
    private documentationService: DocumentationService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog,
    private standardService: StandardService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }


  ngOnInit() {
    this.getTheme();
    this.initMenuName();
    this.pageSize = PAGE_SIZE;
    if (this.standardId == undefined) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.standardId = Number(params.get('id').toString());
        this.obtainStandard(this.standardId);
      });
    } else 
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
      headerTitle: 'Documentación',
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
            name: 'Documentación',
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
    this.documentationService.get(this.skip, this.pageSize, this.searchText, this.standardId)
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



  edit(id: number) {

    this.router.navigate(['/edit-documentation',id]);

  }



  delete(documentation: Documentation) {

    let text: string;
    text = '¿Esta seguro de eliminar el documento: ' + documentation.name + '?';

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

        this.documentationService.delete(documentation.documentationId.toString())
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
    this.documentations = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  add() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddDocumentationComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false,
        data: {
          standardId: this.standardId
        },
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
