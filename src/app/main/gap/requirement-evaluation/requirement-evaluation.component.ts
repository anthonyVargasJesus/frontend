import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { RequirementEvaluationService } from 'app/services/requirement-evaluation.service';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { Requirement } from 'app/models/requirement';
import { MatAccordion } from '@angular/material/expansion';
import { getResults, PAGE_SIZE } from 'app/config/config';


@Component({
  selector: 'app-requirement-evaluation',
  templateUrl: './requirement-evaluation.component.html',
  styleUrls: ['./requirement-evaluation.component.scss']
})


export class RequirementEvaluationComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  requirements: Requirement[] = [];

  legend = [];
  maturityLegend = [];

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
  searchText: string = '';
  results: string;

  isSearch: boolean = false;

  constructor(
    private requirementEvaluationService: RequirementEvaluationService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
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

    if (this.searchText.length > 0)
      this.isSearch = true;
    else
      this.isSearch = false;

    this.loading = true;
    this.requirementEvaluationService.getAllByStandardIdByEvaluationId(this.standardId, this.evaluationId, this.searchText)
      .subscribe((res: any) => {
        this.requirements = res.requirements;
        this.legend = res.legend;
        this.maturityLegend = res.maturityLegend;
        this.results = getResults(this.requirements.length, 1);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }



  search(text: string) {
    this.searchText = text;
    this.get();
  }

  onKeydown(event, text: string) {
    this.searchText = text;
    if (event.key === 'Enter')
      this.search(this.searchText);
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


  updateList(event: string) {
      this.get();
  }

}
