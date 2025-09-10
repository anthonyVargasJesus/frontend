import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header-chart',
  templateUrl: './header-chart.component.html',
  styleUrls: ['./header-chart.component.scss']
})
export class HeaderChartComponent implements OnInit, OnChanges {

  @Input()
  title: string;

  @Input()
  value: number;

  @Input()
  max: number;

  @Input()
  multi = [];

  @Input()
  colorScheme: any;

  view: any[] = [1000, 300];

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
    this.view = [window.innerWidth / 3, 100];
  }

  onSelect(event) {

  }

}
