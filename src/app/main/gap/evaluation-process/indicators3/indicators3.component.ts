import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';


@Component({
  selector: 'app-indicators3',
  templateUrl: './indicators3.component.html',
  styles: [
  ]
})

export class Indicators3Component implements OnInit {

  @Input()
  single: any;

  @Input()
  colorScheme: any;

  view: any[] = [700, 400];

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

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'right';

  // colorScheme = {
  //   domain: ['#ffc000', '#c00000', '#604a7b', '#008000', '#92d050', '#0070c0', 'c00000', '#a6a6a6']
  // };

}
