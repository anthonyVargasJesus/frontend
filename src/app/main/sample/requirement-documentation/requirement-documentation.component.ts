import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Requirement } from 'app/models/requirement';
import { MatAccordion } from '@angular/material/expansion';
import { Subject } from 'rxjs';
import { RequirementService } from 'app/services/requirement.service';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { PAGE_SIZE, getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-requirement-documentation',
  templateUrl: './requirement-documentation.component.html',
  styles: [
  ]
})
export class RequirementDocumentationComponent implements OnInit {


  requirements: Requirement[] = [];
  selectedRow = 0;
  total = 0;
  loading = false;
  results: string;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  @Input()
  standardId: number;

  constructor(
    private requirementService: RequirementService,
    private loginService: LoginService,
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
      headerTitle: 'Documentación',
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
          },
          {
            name: 'ISO 27001',
            isLink: false
          }
        ]
      }
    }
  }


  get() {

    this.loading = true;
    this.requirementService.get(this.standardId)
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.results = getResults(this.total, 0);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }






  edit(id: number) {

   

  }



  delete(requirement: Requirement) {



  }


  asignObjects(res) {
    this.requirements = res.data;
    this.total = res.pagination.totalRows;

  }

  addChild(requirementId: number, level: number) {


  }

}
