import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';


@Component({
  selector: 'app-indicators4',
  templateUrl: './indicators4.component.html',
  styles: [
  ]
})


export class Indicators4Component implements OnInit {

  @Input()
  multi: any;

  @Input()
  colorScheme: any;

  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Requisitos';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  animations: boolean = true;


  coreConfig: any;
  private _unsubscribeAll: Subject<any>;

  constructor(private _coreConfigService: CoreConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  onSelect(event) {

  }


}
