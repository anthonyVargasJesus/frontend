import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { ErrorManager } from 'app/errors/error-manager';
import { User } from 'app/models/user';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { CoreConfig } from 'app/models/interfaces/core-config.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})

export class UserComponent implements OnInit, OnDestroy {
  // Se mantienen exactamente tus nombres de variables
  users: User[] = [];
  page = 1;
  skip = 0;
  pageSize: number = PAGE_SIZE;
  total = 0;
  totalPages = 0;
  loading = false;
  searchText: string = '';
  results: string = '';
  previous = true;
  next = true;
  public contentHeader!: object;
  public currentSkin: string = 'default';
  private _unsubscribeAll: Subject<any>;
  private panelClass: string = '';
  coreConfig!: CoreConfig;

  

  constructor(
    private userService: UserService, 
    private router: Router, 
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService
  ) {
    // Inicializamos el Subject una sola vez en el constructor
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.pageSize = PAGE_SIZE;
    
    // Suscripción unificada a la configuración
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: CoreConfig) => {
        this.coreConfig = config;
        this.currentSkin = config.layout.skin;
        this.setDialogContainerStyle();
      });

    this.initMenuName();
    this.get();
  }

  ngOnDestroy() {
    // Limpieza vital para evitar fugas de memoria en Angular 11
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setDialogContainerStyle() {
    this.panelClass = this.currentSkin === 'dark' 
      ? 'custom-dark-dialog-container' 
      : 'custom-default-dialog-container';
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Usuarios',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'CATÁLOGOS', isLink: false, link: '#' },
          { name: 'Usuarios', isLink: false }
        ]
      }
    };
  }

  get() {
    this.loading = true;
    this.userService.get(this.skip, this.pageSize, this.searchText)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.setColors();
        this.page = (this.skip / this.pageSize) + 1;
        this.results = getResults(this.total, this.totalPages);
        this.loading = false;
        this.disabledPagination();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  // Nombres de métodos originales respetados
  add() {
    this.router.navigate(['/mantto/add-user']);
  }

  edit(id: string) {
    this.router.navigate(['/mantto/edit-user', id]);
  }

  delete(user: User) {
    const text = `¿Esta seguro de eliminar el usuario ${user.name}?`;

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
        this.userService.delete(user.userId!)
          .subscribe(() => {
            this.get();
          });
      }
    });
  }

  search(text: string) {
    this.searchText = text;
    this.skip = 0;
    this.get();
  }

  onKeydown(event: KeyboardEvent, text: string) {
    this.searchText = text;
    if (event.key === 'Enter') {
      this.search(this.searchText);
    }
  }

  changePageSize(value: number) {
    this.pageSize = value;
    this.get();
  }

  changePage(value: number) {
    const desde = this.skip + value;
    if (desde >= this.total || desde < 0) return;

    this.skip += value;
    this.get();
  }

  disabledPagination() {
    this.previous = this.page <= 1;
    this.next = this.page >= this.totalPages;
  }

  asignObjects(res: any) {
    this.users = res.data;
    this.total = res.pagination.totalRows;
    this.totalPages = res.pagination.totalPages;
  }

  setColors() {
    this.users.forEach(user => {
      user.color = this.getRandomColor();
    });
  }

  getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  getState(code: number) {
    if (code == 1) return "text-success";
    if (code == 2) return "text-danger";
  }
}