import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddResponsibleComponent } from './add-responsible/add-responsible.component';
import { EditResponsibleComponent } from './edit-responsible/edit-responsible.component';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styles: [
  ]
})
export class ResponsibleComponent implements OnInit {

  public contentHeader: object;

  constructor(private router: Router,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initMenuName();
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Responsables',
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
        
        ],
        
      }
    }
  }


  add() {

    let dialogRef = this.dialog.open(AddResponsibleComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

    });

  }

  edit() {
    let dialogRef = this.dialog.open(EditResponsibleComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

    });
  }

}
