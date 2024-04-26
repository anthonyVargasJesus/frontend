import { Component, Input, OnInit } from '@angular/core';
import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { Creator } from 'app/models/creator';
import { CreatorService } from 'app/services/creator.service';
import { AddCreatorComponent } from './add-creator/add-creator.component';
import { EditCreatorComponent } from './edit-creator/edit-creator.component';


@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styles: [
  ]
})
export class CreatorComponent implements OnInit {

  creators: Creator[] = [];
  loading = false;
  searchText: string = '';
  results: string;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;


  @Input()
  documentationId: number;

  @Input()
  versionId: number;

  @Input()
  standardId: number;

  constructor(private creatorService: CreatorService, private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getTheme();
    this.initMenuName();
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
      headerTitle: 'Creator',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Creator',
            isLink: false,
            link: '#'
          },
          {
            name: 'Creator',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.creatorService.getAllByversionId(this.versionId)
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  add() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddCreatorComponent, {
        height: '450px',
        width: '450px',
        autoFocus: false,
        data: {
          versionId: this.versionId,
          documentationId: this.documentationId,
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

  edit(id: String) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditCreatorComponent, {
        height: '450px',
        width: '450px',
        data: {
          _id: id,
          versionId: this.versionId,
          documentationId: this.documentationId,
          standardId: this.standardId
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




  delete(creator: Creator) {

    let text: string;
    text = '¿Esta seguro de eliminar el creador?';

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

        this.creatorService.delete(creator.creatorId)
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }


  asignObjects(res) {
    this.creators = res.data;
  }


}
