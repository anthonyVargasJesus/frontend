import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent implements OnInit {

  @Input()
  multi: any[];

  @Input()
  colorScheme: any;

  view: any[] = [1000, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';

  coreConfig: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService) {
    this._unsubscribeAll = new Subject();
  }

  // Escucha cambios en el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setViewSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setViewSize();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  private setViewSize() {
    this.view = [window.innerWidth / 3, 400];
  }

  onSelect(event) {

  }

}
