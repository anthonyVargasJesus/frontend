import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { AddRequirementEvaluationComponent } from './add-requirement-evaluation/add-requirement-evaluation.component';
import { Requirement } from 'app/models/requirement';
import { EditRequirementEvaluationComponent } from './edit-requirement-evaluation/edit-requirement-evaluation.component';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-requirement-evaluation',
  templateUrl: './requirement-evaluation.component.html',
  styleUrls: ['./requirement-evaluation.component.scss']
})
export class RequirementEvaluationComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  requirements: Requirement[] = [];

  loading = false;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  coreConfig: any;

   forceExpand: boolean = false;


  constructor(
    private requirementEvaluationService: RequirementEvaluationService,
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
      headerTitle: 'RequirementEvaluation',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'RequirementEvaluation',
            isLink: false,
            link: '#'
          },
          {
            name: 'RequirementEvaluation',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.requirementEvaluationService.getAllByStandardIdByEvaluationId(this.standardId, this.evaluationId)
      .subscribe((res: any) => {
        this.requirements = res.data;
        console.log(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }



  add(requirement: Requirement) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddRequirementEvaluationComponent, {
        height: '780px',
        width: '780px',
        autoFocus: false,
        data: {
          requirementId: requirement.requirementId,
          requirementName: requirement.name,
          numeration: requirement.numerationToShow,
          standardId: this.standardId,
          evaluationId: this.evaluationId,
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

  edit() {

      if (this.loginService.isAuthenticated()) {
        let dialogRef = this.dialog.open(EditRequirementEvaluationComponent, {
          height: '780px',
          width: '780px',
          data: {
            _id: 1,
            standardId: this.standardId,
            requirementName: "requirementEvaluation.requirement.name",
            numeration: "1",
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

  delete(requirementEvaluation: RequirementEvaluation, deleted: boolean) {

    let text: string;
    if (deleted)
      text = '¿Esta seguro de eliminar la requirementEvaluation ' + requirementEvaluation.value + '?';

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

        this.requirementEvaluationService.delete(Number(requirementEvaluation.requirementEvaluationId))
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }


  updateEvent() {
    //this.get();
  }

  expandAll() {
    this.forceExpand = true;
    this.accordion.openAll();
  }

  collapseAll() {
    this.accordion.closeAll();
  }

  

}
