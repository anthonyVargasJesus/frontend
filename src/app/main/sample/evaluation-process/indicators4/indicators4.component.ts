import { Component, Input, OnInit } from '@angular/core';

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
