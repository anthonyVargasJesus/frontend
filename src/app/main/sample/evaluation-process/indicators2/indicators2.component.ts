import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators2',
  templateUrl: './indicators2.component.html',
  styles: [
  ]
})
export class Indicators2Component implements OnInit {

  multi: any[] = [
    {
      "name": "Cláusula 4 - Contexto de la organización",
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
      "name": "Cláusula 5 - Liderazgo",
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
      "name": "Cláusula 6 - Planificación",
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
      "name": "Cláusula 7 - Soporte",
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
      "name": "Cláusula 8 - Operación",
      "series": [
        {
          "name": "No implementada",
          "value": 8
        },
        {
          "name": "Gestionado",
          "value": 16
        }
      ]
    },

    {
      "name": "Cláusula 9 - Evaluación de desempeño",
      "series": [
        {
          "name": "No aplica",
          "value": 25
        },
        {
          "name": "Establecido",
          "value": 5
        }
      ]
    },

    {
      "name": "Cláusula 10 - Mejora del SGSI",
      "series": [
        {
          "name": "No implementada",
          "value": 10
        },
        {
          "name": "No aplica",
          "value": 10
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
