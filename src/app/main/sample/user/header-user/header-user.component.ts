import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'app/models/user';


@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styles: [
  ]
})
export class HeaderUserComponent implements OnInit {

  @Input()
  user: User;

  constructor(private dialog: MatDialog, public router: Router) { }

  ngOnInit(): void {
 
  }

  uploadImage() {

    // let dialogRef = this.dialog.open(ModalImageUserComponent, {
    //   height: '565px',
    //   width: '550px',
    //   data: { _id: this.user._id },
    //   autoFocus: false
    // });

    // dialogRef.afterClosed().subscribe(data => {
      
    // });

  }

  navigateToBack() {
    this.router.navigate(['/user']);
  }
  
}
