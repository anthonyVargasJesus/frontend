import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { ReferenceDocumentationService } from 'app/services/reference-documentation.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
// import { EditReferenceDocumentationByRequirementEvaluationComponent } from './edit-reference-documentation-by-requirement-evaluation/edit-reference-documentation-by-requirement-evaluation.component';
// import { AddReferenceDocumentationByRequirementEvaluationComponent } from './add-reference-documentation-by-requirement-evaluation/add-reference-documentation-by-requirement-evaluation.component';
import { MatDialog } from '@angular/material/dialog';
import { AddReferenceDocumentationComponent } from './add-reference-documentation/add-reference-documentation.component';
import { EditReferenceDocumentationComponent } from './edit-reference-documentation/edit-reference-documentation.component';


@Component({
  selector: 'app-reference-documentation-by-requirement-evaluation',
  templateUrl: './reference-documentation-by-requirement-evaluation.component.html',
  styles: [
  ]
})


export class ReferenceDocumentationByRequirementEvaluationComponent implements OnInit {


  referenceDocumentations: ReferenceDocumentation[] = [];
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
  requirementEvaluationId: number;

  @Input()
  controlEvaluationId: number;

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  @Output() updateEvent = new EventEmitter<string>();

  constructor(private referenceDocumentationService: ReferenceDocumentationService, private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getTheme();
    this.initMenuName();
    this.pageSize = PAGE_SIZE;
    this.callData();
  }


  callData() {
    if (this.controlEvaluationId != null && this.controlEvaluationId > 0)
      this.getByControl();
    else
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
      headerTitle: 'ReferenceDocumentation',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'ReferenceDocumentation',
            isLink: false,
            link: '#'
          },
          {
            name: 'ReferenceDocumentation',
            isLink: false
          }
        ]
      }
    }
  }

  get() {
    this.loading = true;
    this.referenceDocumentationService.getByrequirementEvaluationId(this.skip, this.pageSize, this.requirementEvaluationId, this.searchText)
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

  getByControl() {
    this.loading = true;
    this.referenceDocumentationService.getByControlEvaluationId(this.skip, this.pageSize, this.controlEvaluationId, this.searchText)
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
    this.callData();
  }

  changePage(value: number) {
    const desde = this.skip + value;
    if (desde >= this.total)
      return;

    if (desde < 0)
      return;

    this.skip += value;
    this.callData();
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
      let dialogRef = this.dialog.open(AddReferenceDocumentationComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false,
        data: {
          requirementEvaluationId: this.requirementEvaluationId,
          controlEvaluationId: this.controlEvaluationId,
          evaluationId: this.evaluationId,
          standardId: this.standardId,
          panelClass: this.panelClass
        },
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true) {
          this.callData();
          this.updateEvent.emit();
        }

      });
    }

  }

  edit(referenceDocumentation: ReferenceDocumentation) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditReferenceDocumentationComponent, {
        height: '600px',
        width: '600px',
        data: {
          _id: referenceDocumentation.referenceDocumentationId,
          requirementEvaluationId: this.requirementEvaluationId,
          controlEvaluationId: this.controlEvaluationId,
          evaluationId: this.evaluationId,
          standardId: this.standardId,
          panelClass: this.panelClass
        },
        autoFocus: false,
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true) {
          this.callData();
          this.updateEvent.emit();
        }

      });
    }

  }

  delete(referenceDocumentation: ReferenceDocumentation) {

    let text: string;
    text = '¿Está seguro de eliminar el registro ' + referenceDocumentation.name + '?';

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

        this.referenceDocumentationService.delete(referenceDocumentation.referenceDocumentationId)
          .subscribe(deleted => {
            this.callData();
            this.updateEvent.emit();
          });

      }
    })

  }

  search(text: string) {
    this.searchText = text;
    this.skip = 0;
    this.callData();
  }

  onKeydown(event, text: string) {
    this.searchText = text;
    if (event.key === 'Enter')
      this.search(this.searchText);
  }

  asignObjects(res) {
    this.referenceDocumentations = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}  //{
//path: 'reference-documentation',
//component: ReferenceDocumentationComponent,
//data: { animation: 'reference-documentation' }
//},

//ReferenceDocumentationComponent, AddReferenceDocumentationComponent, EditReferenceDocumentationComponent
//{
//id: 'referenceDocumentation',
//title: '',
//translate: 'MENU.REFERENCEDOCUMENTATION',
//type: 'item',
//icon: 'file',
//url: 'referenceDocumentation'
//},

//   REFERENCEDOCUMENTATION: 'ReferenceDocumentation'


