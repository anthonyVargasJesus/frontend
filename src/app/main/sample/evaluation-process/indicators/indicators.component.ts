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
    console.log('take', this.colorScheme)
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
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
