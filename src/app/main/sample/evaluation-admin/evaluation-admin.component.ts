import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddEvaluationAdminComponent } from './add-evaluation-admin/add-evaluation-admin.component';
import { EditEvaluationAdminComponent } from './edit-evaluation-admin/edit-evaluation-admin.component';

@Component({
  selector: 'app-evaluation-admin',
  templateUrl: './evaluation-admin.component.html',
  styles: [
  ]
})
export class EvaluationAdminComponent implements OnInit {

  public contentHeader: object;

  constructor(private router: Router,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initMenuName();
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Mantenimiento',
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
            name: 'Mantenimiento',
            isLink: false
          }
        ]
      }
    }
  }


  add() {
    let dialogRef = this.dialog.open(AddEvaluationAdminComponent, {
      height: '550px',
      width: '550px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

    });
  }

  edit() {
    let dialogRef = this.dialog.open(EditEvaluationAdminComponent, {
      height: '550px',
      width: '550px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

    });
  }

}
