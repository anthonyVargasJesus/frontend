import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from 'app/services/login.service';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { AddReferenceDocumentationInStorageComponent } from './add-reference-documentation-in-storage/add-reference-documentation-in-storage.component';
import { EditReferenceDocumentationInStorageComponent } from './edit-reference-documentation-in-storage/edit-reference-documentation-in-storage.component';
import { getReferenceDocsKey } from 'app/config/config';

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

  @Input()
  controlEvaluationId: number;

  searchText: string = '';

  constructor(private loginService: LoginService,
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

    let LS_KEY = getReferenceDocsKey(this.controlEvaluationId, this.requirementEvaluationId);
    const stored = localStorage.getItem(LS_KEY);

    const references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];

    this.referenceDocumentations = references;
    this.results = 'Evidencias encontradas: ' + this.referenceDocumentations.length;

  }

  add() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddReferenceDocumentationInStorageComponent, {
        height: '550px',
        width: '600px',
        autoFocus: false,
        data: {
          standardId: this.standardId,
          requirementEvaluationId: this.requirementEvaluationId,
          controlEvaluationId: this.controlEvaluationId,
          panelClass: this.panelClass,
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

  edit(referenceDocumentation: ReferenceDocumentation) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditReferenceDocumentationInStorageComponent, {
        height: '550px',
        width: '600px',
        autoFocus: false,
        data: {
          standardId: this.standardId,
          referenceDocumentationId: referenceDocumentation.referenceDocumentationId,
          requirementEvaluationId: this.requirementEvaluationId,
          controlEvaluationId: this.controlEvaluationId,
          panelClass: this.panelClass,
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

  delete(referenceDocumentation: ReferenceDocumentation) {

    let text: string;
    text = '¿Está seguro de eliminar el archivo ' + referenceDocumentation.name + '?';

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

        this.remove(referenceDocumentation.referenceDocumentationId);
        Swal.fire(
          'Eliminado',
          'El archivo ha sido eliminado correctamente.',
          'success'
        );

      }
    })

  }

  remove(referenceDocumentationId: number) {

    let LS_KEY = getReferenceDocsKey(this.controlEvaluationId, this.requirementEvaluationId);

    const stored = localStorage.getItem(LS_KEY);

    let references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];

    // Filtrar el elemento que no queremos eliminar
    references = references.filter(ref => ref.referenceDocumentationId !== referenceDocumentationId);

    // Guardar nuevamente en localStorage
    localStorage.setItem(LS_KEY, JSON.stringify(references));

    // Actualizar lista en memoria si es necesario
    this.referenceDocumentations = references;
  }

  onKeydown(event, text: string) {
    this.searchText = text;
    if (event.key === 'Enter')
      this.searchByNameContains(text);
  }

  search(text: string) {
    this.searchText = text;
    this.searchByNameContains(this.searchText);
  }

  searchByNameContains(namePart: string) {

    let LS_KEY = getReferenceDocsKey(this.controlEvaluationId, this.requirementEvaluationId);

    const stored = localStorage.getItem(LS_KEY);

    const references: ReferenceDocumentation[] = stored
      ? JSON.parse(stored)
      : [];

    const searchTerm = namePart.trim().toLowerCase();

    this.referenceDocumentations = references.filter(ref =>
      ref.name?.toLowerCase().includes(searchTerm)
    );
  }


}
