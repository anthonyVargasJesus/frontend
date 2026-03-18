import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'app/models/user';
import { ModalImageUserComponent } from '../modal-image-user/modal-image-user.component';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';


@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styles: [
  ]
})
export class HeaderUserComponent implements OnInit {

  @Input()
  user: User;

  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  constructor(private dialog: MatDialog, public router: Router,
    private _coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
    this.getTheme();
  }

  getTheme() {
    this._unsubscribeAll = new Subject();
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.currentSkin = config.layout.skin;
        this.setDialogContainerStyle();
      });
  }

  setDialogContainerStyle() {
    if (this.currentSkin == 'dark')
      this.panelClass = 'custom-dark-dialog-container';
    else
      this.panelClass = 'custom-default-dialog-container';
  }


  uploadImage() {

    let dialogRef = this.dialog.open(ModalImageUserComponent, {
      height: '620px',
      width: '570px',
      data: { userId: this.user.userId },
      autoFocus: false,
      panelClass: this.panelClass
    });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        this.user.image = data.image;
      });

  }

  navigateToBack() {
    this.router.navigate(['/mantto/user']);
  }

}
