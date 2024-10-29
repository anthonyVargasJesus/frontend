import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styles: [
  ]
})
export class IndicatorsComponent implements OnInit {

  @Input()
  single: any;

  @Input()
  colorScheme: any;

  view: any[] = [700, 400];


  constructor() {
    
  }

  ngOnInit(): void {

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



  onSelect(data): void {

  }

  onActivate(data): void {
   
  }

  onDeactivate(data): void {

  }

}
