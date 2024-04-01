import { Component, OnInit } from '@angular/core';
import { DemoDetalleRepairsComponent } from '../demo-detalle-repairs/demo-detalle-repairs.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-demo-detalle',
  templateUrl: './demo-detalle.component.html',
  styles: [
  ]
})
export class DemoDetalleComponent implements OnInit {

  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  
  constructor(private dialog: MatDialog, private _coreConfigService: CoreConfigService,) { }

  ngOnInit(): void {
    this.initMenuName();
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


  viewRepairs(path: string, name: string) {

      let dialogRef = this.dialog.open(DemoDetalleRepairsComponent, {
        height: '700px',
        width: '750px',
        autoFocus: false,
        panelClass: this.panelClass,
        data: {
          path: path,
          name: name,
        },
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

      });

  }

}
