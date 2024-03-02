import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-process',
  templateUrl: './evaluation-process.component.html',
  styles: [
  ]
})

export class EvaluationProcessComponent implements OnInit {


  public contentHeader: object;

  constructor(

    private router: Router,
  ) { }


  loading = false;
  loading2 = false;

  public submitted = false;


  ngOnInit(): void {

    this.initMenuName();
  }


  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Normas',
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
            name: 'Normas',
            isLink: false
          },
          {
            name: 'ISO 27001',
            isLink: false
          }
        ]
      }
    }
  }





  save() {


  } 
  
  navigateToBack() {
    this.router.navigate(['/evaluation-process-list']);
  }

}
