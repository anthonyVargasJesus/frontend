import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators3',
  templateUrl: './indicators3.component.html',
  styles: [
  ]
})
export class Indicators3Component implements OnInit {

  single: any[]= [
    {
      "name": "Inicial",
      "value": 8940000
    },
    {
      "name": "No implementada",
      "value": 5000000
    },
    {
      "name": "Gestionado",
      "value": 7200000
    },
      {
      "name": "Optimizado",
      "value": 6200000
    },
    {
      "name": "Predecible",
      "value": 0
    },
    {
      "name": "Establecido",
      "value": 0
    },
    {
      "name": "No implementada",
      "value": 0
    },
    {
      "name": "No aplica",
      "value": 0
    }
  ];

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

  colorScheme = {
    domain: ['#ffc000', '#c00000', '#604a7b', '#008000', '#92d050', '#0070c0', 'c00000', '#a6a6a6']
  };



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
