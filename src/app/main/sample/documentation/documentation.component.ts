import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddDocumentationComponent } from './add-documentation/add-documentation.component';
import { EditDocumentationComponent } from './edit-documentation/edit-documentation.component';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styles: [
  ]
})
export class DocumentationComponent implements OnInit {

  public contentHeader: object;

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initMenuName();
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Opciones',
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
            name: 'Opciones',
            isLink: false
          }
        ]
      }
    }
  }


  add() {
    let dialogRef = this.dialog.open(AddDocumentationComponent, {
      height: '570px',
      width: '550px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

    });
  }

  edit() {
    let dialogRef = this.dialog.open(EditDocumentationComponent, {
      height: '570px',
      width: '550px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == null)
        return;

    });
  }


}
