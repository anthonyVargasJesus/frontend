import { Component, OnInit } from '@angular/core'
import { FormBuilder,} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ErrorManager } from 'app/errors/error-manager';
import { Router } from '@angular/router';
import { EvaluationService } from 'app/services/evaluation.service';
import { Evaluation } from 'app/models/evaluation';
import { saveAs } from 'file-saver';
import { Scope } from 'app/models/scope';
import { Policy } from 'app/models/policy';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {


  public contentHeader: object;
  public submitted = false;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  coreConfig: any;

  evaluation: Evaluation = new Evaluation();
  loading = false;
  loadingExcel = false;

  evaluationId: string;
  standardId: string = '';
  standardName: string = '';

  currentScope: Scope = new Scope();
  currentPolicy: Policy = new Policy();

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _coreConfigService: CoreConfigService,
    private router: Router,
    private evaluationService: EvaluationService,
  ) {

    this._unsubscribeAll = new Subject();

  }


  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.getCurrent();

  }

  getCurrent() {
    this.loading = true;
    this.evaluationService.getCurrent()
      .subscribe((res: any) => {

        console.log(res);

        this.evaluation = res.data;
        this.standardId = this.evaluation.standardId.toString();
        this.evaluationId =  this.evaluation.evaluationId.toString();
        this.standardName = this.evaluation.standard.name;
       
        this.currentScope = res.data.currentScope;
        this.currentPolicy = res.data.currentPolicy;

        this.loading = false;
        this.initMenuName();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }



  initMenuName() {

    this.contentHeader = {
      headerTitle: 'RESUMEN DE RESULTADOS',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'EVALUACIÓN',
            isLink: false,
            link: '#'
          },
          {
            name: 'Resumen',
            isLink: false
          },
        ]
      }
    }
  }

  public downloadExcel(): any {

    this.loadingExcel = true;
    var fileName = 'dashboard.xlsx';
    var mediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    this.evaluationService.getExcelDashboard(this.standardId.toString(), this.evaluationId.toString())
      .subscribe(res => {
        this.loadingExcel = false;

        var blob = new Blob([res], { type: mediaType });
        saveAs(blob, fileName);

      }, error => {
        this.loadingExcel = false;
        ErrorManager.handleError(error);
      });

  }

}
