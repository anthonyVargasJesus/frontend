import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annual-summary',
  templateUrl: './annual-summary.component.html',
  styles: [
  ]
})
export class AnnualSummaryComponent implements OnInit {

  constructor() { }

  public contentHeader: object;

  ngOnInit(): void {
    this.initMenuName();
  }


  initMenuName() {


    this.contentHeader = {
      headerTitle: 'Resumen evaluaciones por año',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: false,
            link: '#'
          },
        
        ]
      }
    }
  }

}
