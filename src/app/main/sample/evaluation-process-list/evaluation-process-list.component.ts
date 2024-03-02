import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-process-list',
  templateUrl: './evaluation-process-list.component.html',
  styles: [
  ]
})
export class EvaluationProcessListComponent implements OnInit {

  public contentHeader: object;

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initMenuName();
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Cargar',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Evaluaciones',
            isLink: false,
            link: '#'
          },
          {
            name: 'Cargar',
            isLink: false
          }
        ]
      }
    }
  }


  add() {
    // let dialogRef = this.dialog.open(AddEvaluationAdminComponent, {
    //   height: '550px',
    //   width: '550px',
    //   autoFocus: false,
    // });

    // dialogRef.afterClosed().subscribe(data => {
    //   if (data == null)
    //     return;

    // });
  }

  edit() {
    this.router.navigate(['/evaluation-process']);
  }


}
