import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styles: [
  ]
})
export class LineChartComponent implements OnInit {

  multi = [
    {
      "name": "",
      "series": [
        {
          "name": "2019",
          "value": 32
        },
        {
          "name": "2020",
          "value": 55
        },
        {
          "name": "2021",
          "value": 62
        },
        {
          "name": "2022",
          "value": 63
        },
        {
          "name": "2023",
          "value": 80
        },
        {
          "name": "2024",
          "value": 89
        }
      ]
    },
  
    
  ];

  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Años';
  yAxisLabel: string = 'Puntaje';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };




  ngOnInit(): void {
  }

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
