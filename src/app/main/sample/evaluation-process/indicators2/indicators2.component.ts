import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators2',
  templateUrl: './indicators2.component.html',
  styles: [
  ]
})
export class Indicators2Component implements OnInit {

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
  xAxisLabel: string = 'Requerimientos';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = '';
  animations: boolean = true;


  constructor() {
   
  }



  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
  }

}
