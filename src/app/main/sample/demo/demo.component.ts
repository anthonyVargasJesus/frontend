import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styles: [
  ]
})
export class DemoComponent implements OnInit {

  public contentHeader: object;

  constructor(private router: Router,) { }

  ngOnInit(): void {
    this.initMenuName();
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Inventario de activos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Configuración',
            isLink: false,
            link: '#'
          },
          {
            name: 'Inventario',
            isLink: false
          },
          {
            name: 'Consulta',
            isLink: false
          }
        ]
      }
    }
  }


  add(){
    this.router.navigate(['/demo-detalle']);
  }

  search(text: string){

  }

}
