import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { LoginService } from 'app/services/login.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';
import { DefaultSection } from 'app/models/default-section';
import { DefaultSectionService } from 'app/services/default-section.service';
import { AddDefaultSectionComponent } from './add-default-section/add-default-section.component';
import { EditDefaultSectionComponent } from './edit-default-section/edit-default-section.component';


@Component({
  selector: 'app-default-section',
  templateUrl: './default-section.component.html',
  styles: [
  ]
})
export class DefaultSectionComponent implements OnInit {

  defaultSections: DefaultSection[] = [];
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
  documentTypeId: number;

  
  constructor(
    private defaultSectionService: DefaultSectionService,
    private router: Router,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {

    

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
      headerTitle: 'Secciones',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Documentación',
            isLink: false,
            link: '#'
          },
          {
            name: 'Tipos de documento',
            isLink: false
          }
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
    this.defaultSectionService.get(this.skip, this.pageSize, this.searchText, this.documentTypeId)
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
      let dialogRef = this.dialog.open(AddDefaultSectionComponent, {
        height: '550px',
        width: '550px',
        data: { 
          documentTypeId: this.documentTypeId,
         },
        autoFocus: false, panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.get();
      });
    }

  }


  addChild(defaultSectionId: number, level: number) {
    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddDefaultSectionComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false,
        data: {
          documentTypeId: this.documentTypeId,
          defaultSectionId: defaultSectionId,
          level: level,
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


  edit(id: number) {
    
    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditDefaultSectionComponent, {
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

  delete(defaultSection: DefaultSection) {

    let text: string;
    text = '¿Esta seguro de eliminar el tipo de documento ' + defaultSection.name + '?';

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

        this.defaultSectionService.delete(defaultSection.defaultSectionId.toString())
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
    this.defaultSections = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

}
