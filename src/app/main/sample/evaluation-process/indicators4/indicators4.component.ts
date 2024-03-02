import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators4',
  templateUrl: './indicators4.component.html',
  styles: [
  ]
})
export class Indicators4Component implements OnInit {

  multi: any[] = [
    {
      "name": "Anexo 5 - Controles organizacionales",
      "series": [
        {
          "name": "No implementada",
          "value": 5
        },
        {
          "name": "Gestionado",
          "value": 2
        }
      ]
    },
  
    {
      "name": "Anexo 6 - Controles de personas",
      "series": [
        {
          "name": "No implementada",
          "value": 10
        },
        {
          "name": "Gestionado",
          "value": 25
        }
      ]
    },
  
    {
      "name": "Anexo 7 - Controles físicos",
      "series": [
        {
          "name": "Optimizado",
          "value": 30
        },
        {
          "name": "Predecible",
          "value": 15
        }
      ]
    },

    {
      "name": "Anexo 8 - Controles tecnológicos",
      "series": [
        {
          "name": "No implementada",
          "value": 5
        },
        {
          "name": "Gestionado",
          "value": 2
        }
      ]
    },


  ];
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

  colorScheme = {
    domain: ['#ffc000', '#c00000', '#604a7b', '#008000', '#92d050', '#0070c0', 'c00000', '#a6a6a6']
  };

  constructor() {
   
  }



  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
  }

}
