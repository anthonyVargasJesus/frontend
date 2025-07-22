import { Component, Input, OnInit } from '@angular/core';
import { getResults, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { ReferenceDocumentationService } from 'app/services/reference-documentation.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { ReferenceDocumentationInStorageService } from 'app/services/reference-documentation-in-storage.service';
import { AddReferenceDocumentationInStorageComponent } from './add-reference-documentation-in-storage/add-reference-documentation-in-storage.component';

@Component({
  selector: 'app-reference-documentation-in-storage',
  templateUrl: './reference-documentation-in-storage.component.html',
  styles: [
  ]
})

export class ReferenceDocumentationInStorageComponent implements OnInit {

  referenceDocumentations: ReferenceDocumentation[] = [];
  loading = false;
  results: string;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  @Input()
  standardId: number;

  @Input()
  requirementEvaluationId: number;


  constructor(private referenceDocumentationService: ReferenceDocumentationInStorageService, private loginService: LoginService,
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

    const LS_KEY = 'referenceDocs';
    const stored = localStorage.getItem(LS_KEY);

    const references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];

    this.referenceDocumentations = references;


  }





  add() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddReferenceDocumentationInStorageComponent, {
        height: '600px',
        width: '600px',
        autoFocus: false,
        data: {
          standardId: this.standardId,
          requirementEvaluationId: this.requirementEvaluationId
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
            this.get();
          });

      }
    })

  }



}
