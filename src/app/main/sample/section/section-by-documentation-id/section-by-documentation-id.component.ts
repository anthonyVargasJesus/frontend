import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { LoginService } from 'app/services/login.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';
import { Section } from 'app/models/section';
import { SectionService } from 'app/services/section.service';
import { AddSectionComponent } from '../add-section/add-section.component';
import { EditSectionComponent } from '../edit-section/edit-section.component';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-section-by-documentation-id',
  templateUrl: './section-by-documentation-id.component.html',
  styles: [
  ]
})
export class SectionByDocumentationIdComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  sections: Section[] = [];
  loading = false;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  coreConfig: any;
  
  @Input()
  documentationId: number;

  constructor(
    private sectionService: SectionService,
    private router: Router,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
  
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.getTheme();
    this.initMenuName();
    this.get();
  }

  expandAll(){
    this.accordion.openAll();
  }

  collapseAll(){
    this.accordion.closeAll();
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
            name: 'Versionamiento',
            isLink: false
          }
        ]
      }
    }
  }


  get() {

    this.loading = true;
    this.sectionService.getByDocumentationId(this.documentationId)
      .subscribe((res: any) => {
        this.asignObjects(res);
        console.log(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  add() {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddSectionComponent, {
        height: '550px',
        width: '550px',
        data: {
          documentationId: this.documentationId,
          sectionId: 0,
          level: 1,
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


  addChild(sectionId: number, level: number) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddSectionComponent, {
        height: '700px',
        width: '800px',
        autoFocus: false,
        data: {
          sectionId: sectionId,
          level: level,
          documentationId: this.documentationId,
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
      let dialogRef = this.dialog.open(EditSectionComponent, {
        height: '700px',
        width: '700px',
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

  delete(section: Section) {

    let text: string;
    text = '¿Esta seguro de eliminar la sección?';

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

        this.sectionService.delete(section.sectionId.toString())
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }




  asignObjects(res) {
    this.sections = res.data;
  }

}
