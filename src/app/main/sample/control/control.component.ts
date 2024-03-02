import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditControlComponent } from './edit-control/edit-control.component';
import { Control } from 'app/models/control';
import { Subject } from 'rxjs';
import { ControlService } from 'app/services/control.service';
import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import { AddControlComponent } from './add-control/add-control.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styles: [
  ]
})
export class ControlComponent implements OnInit {

  controls: Control[] = [];
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
  controlGroupId: number; 

  @Input()
  controlGroupNumber: number = 0;

  @Input()
  standardId: number ;

  constructor(
    private controlService: ControlService,
    private router: Router,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    console.log('this.controlGroupId', this.controlGroupId);
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
      headerTitle: 'Normas',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Configuración',
            isLink: false,
            link: '#'
          },
          {
            name: 'Normas',
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
    this.controlService.get(this.skip, this.pageSize, this.searchText, this.controlGroupId)
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

    if (this.loginService.isAuthenticated()) {
    let dialogRef = this.dialog.open(AddControlComponent, {
      height: '600px',
      width: '600px',
      autoFocus: false, 
      data: { 
        controlGroupId: this.controlGroupId, 
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


  edit(id: number) {
    console.log('id', id);
    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditControlComponent, {
        height: '600px',
        width: '600px',
        data: { 
         _id: id,},
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


  delete(control: Control) {

    let text: string;
    text = '¿Esta seguro de eliminar el control ' + control.name + '?';

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

        this.controlService.delete(control.controlId.toString())
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
    this.controls = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }


}
