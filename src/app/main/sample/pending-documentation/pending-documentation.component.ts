import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EvaluationService } from 'app/services/evaluation.service';


@Component({
  selector: 'app-pending-documentation',
  templateUrl: './pending-documentation.component.html',
  styles: [
  ]
})
export class PendingDocumentationComponent implements OnInit {


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

  @Input()
  evaluationId: number;

  standard: Standard = new Standard();

  constructor(
    private evaluationService: EvaluationService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog,
  ) {

  }


  ngOnInit() {
    this.getTheme();
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


  search(text: string) {
    this.searchText = text;
    this.skip = 0;

    this.get();
  }

  
  get() {

    this.loading = true;
    this.evaluationService.getPendingDocumentation(this.skip, this.pageSize, this.searchText, this.standardId, this.evaluationId)
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

    // if (this.loginService.isAuthenticated()) {
    //   let dialogRef = this.dialog.open(EditDocumentationComponent, {
    //     height: '650px',
    //     width: '650px',
    //     data: {
    //       _id: id,
    //       standardId: this.standardId
    //     },
    //     autoFocus: false,
    //     panelClass: this.panelClass
    //   });

    //   dialogRef.afterClosed().subscribe(data => {
    //     if (data == null)
    //       return;

    //     if (data.updated == true)
    //       this.get();
    //   });
    // }

  }



  delete(documentation: Documentation) {


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


  }

}
