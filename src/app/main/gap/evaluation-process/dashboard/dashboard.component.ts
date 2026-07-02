import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { ErrorManager } from 'app/errors/error-manager';
import { Indicator } from 'app/models/indicator';
import { MaturityLevel } from 'app/models/maturity-level';
import { Requirement } from 'app/models/requirement';
import { EvaluationService } from 'app/services/evaluation.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})


export class DashboardComponent implements OnInit {

  maturityLevels: MaturityLevel[] = [];
  requirements: Requirement[] = [];
  indicators: any[] = [];



  total: number = 0;
  pieDashboardRequirementDto: any;
  bartVerticalDashboardRequirementDto: any;


  // Requirements Indicator
  headerData: any = [];
  requirementsIndicator: any;
  title: string = '';
  value: number = 0;
  headerColorScheme: any = {
    domain: [],
    group: 'Ordinal',
    selectable: true,
    name: 'Custom Scheme'
  };
  colorScheme: any = {
    domain: [],
    group: 'Ordinal',
    selectable: true,
    name: 'Custom Scheme'
  };
  maximum: number;
  radarData: any[];


  //control dashboard
  controlHeaderData: any = [];
  controlsIndicator: any;
  controlTitle: string = '';
  controlValue: number = 0;
  controlHeaderColorScheme: any = {
    domain: [],
    group: 'Ordinal',
    selectable: true,
    name: 'Custom Scheme'
  };
  controlColorScheme: any = {
    domain: [],
    group: 'Ordinal',
    selectable: true,
    name: 'Custom Scheme'
  };
  controlMaximum: number;
  controlRadarData: any[];

  loading = false;
  loadingExcel = false;

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  @Input()
  standardName: string;

  coreConfig: any;
  private _unsubscribeAll: Subject<any>;

  constructor(private evaluationService: EvaluationService, private _coreConfigService: CoreConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
    this.getDashboard();
  }

  getDashboard() {
    this.loading = true;
    this.evaluationService.getDashboard(this.standardId, this.evaluationId)
      .subscribe((res: any) => {

        this.maturityLevels = res.maturityLevels;
        this.requirements = res.requirements;
        this.indicators = res.indicators;

        this.total = res.value;

        this.pieDashboardRequirementDto = res.pieDashboardRequirementDto;
        this.bartVerticalDashboardRequirementDto = res.bartVerticalDashboardRequirementDto;

        //this.dataRadar = res.requirements.map(item => this.convertToChartObject(item.requirement, item.indicators));
        //this.radarData = this.convertToChartObject(this.requirements, res.indicators);

        this.requirementsIndicator = res.requirementsIndicator;
        this.maximum = res.requirementsIndicator.maximum;

        this.colorScheme = {
          domain: this.getArrayColors(this.indicators),
          group: 'Ordinal',
          selectable: true,
          name: 'Custom Scheme'
        };

        this.radarData = this.normalizeIndicators(this.indicators);

        const requirementIndicatorName = this.safeIndicatorName(this.requirementsIndicator);

        this.headerData = [{
          'name': requirementIndicatorName,
          'value': this.requirementsIndicator.value || 0
        }];

        this.headerColorScheme = {
          domain: [this.safeIndicatorColor(this.requirementsIndicator)],
          group: 'Ordinal',
          selectable: true,
          name: 'Custom Scheme'
        };

        this.title = requirementIndicatorName;
        this.value = this.requirementsIndicator.value || 0;


        this.loading = false;


        this.getControlDashboard();

      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  // ngx-charts crashes (formatLabel/label.toLocaleString) when a bar's name is null,
  // which happens when an indicator's average value doesn't fall in any calificación range
  safeIndicatorName(indicator: any): string {
    return indicator && indicator.name ? indicator.name : 'Sin calificación';
  }

  safeIndicatorColor(indicator: any): string {
    return indicator && indicator.color ? indicator.color : '#b4b7bd';
  }

  normalizeIndicators(indicators: any[]): any[] {

    return indicators.map(ind => ({
      name: ind.name.toString(),
      series: ind.series.map(s => ({
        name: s.name.toString(),
        value: !isNaN(Number(s.value)) ? Number(s.value) : 0
      }))
    }));
  }

  getArrayColors(data: any[]) {
    let colores = data.map(item => item.color);
    return colores;
  }

  getControlDashboard() {
    this.loading = true;
    this.evaluationService.getControlDashboard(this.standardId, this.evaluationId)
      .subscribe((res: any) => {

        this.controlsIndicator = res.controlsIndicator;
        this.controlMaximum = res.controlsIndicator.maximum;

        const controlIndicatorName = this.safeIndicatorName(this.controlsIndicator);

        this.controlHeaderData = [{
          'name': controlIndicatorName,
          'value': this.controlsIndicator.value || 0
        }];

        this.controlHeaderColorScheme = {
          domain: [this.safeIndicatorColor(this.controlsIndicator)],
          group: 'Ordinal',
          selectable: true,
          name: 'Custom Scheme'
        };

        this.controlColorScheme = {
          domain: this.getArrayColors(res.indicators),
          group: 'Ordinal',
          selectable: true,
          name: 'Custom Scheme'
        };

        this.controlTitle = controlIndicatorName;
        this.controlValue = this.controlsIndicator.value || 0;

        this.controlRadarData = this.normalizeControlIndicators(res.indicators);

        // this.maturityLevels = res.maturityLevels;
        // this.controlGroups = res.controlGroups;
        // this.total = res.value;

        //  this.pieControlDashboardControlGroup = res.pieControlDashboardControlGroup;
        // this.bartVerticalDashboardControlGroupDto = res.bartVerticalDashboardControlGroupDto;

        // this.colorScheme = {
        //   domain: res.colors
        // };

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  normalizeControlIndicators(indicators: any[]): any[] {

    return indicators.map(ind => ({
      name: ind.name.toString(),
      series: ind.series.map(s => ({
        name: s.name.toString(),
        value: !isNaN(Number(s.value)) ? Number(s.value) : 0
      }))
    }));
  }

}
