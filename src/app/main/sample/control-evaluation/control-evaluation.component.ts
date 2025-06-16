import { Component, Input, OnInit } from '@angular/core';
import { getResults, getSearchResults, INIT_PAGE, PAGE_SIZE } from 'app/config/config';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlEvaluation } from 'app/models/control-evaluation';
import { ControlEvaluationService } from 'app/services/control-evaluation.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs/internal/Subject';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { MatDialog } from '@angular/material/dialog';
import { AddControlEvaluationComponent } from './add-control-evaluation/add-control-evaluation.component';
import { Control } from 'app/models/control';
import { EditControlEvaluationComponent } from './edit-control-evaluation/edit-control-evaluation.component';
import { ControlGroup } from 'app/models/control-group';

@Component({
  selector: 'app-control-evaluation',
  templateUrl: './control-evaluation.component.html',
  styles: [
  ]
})
export class ControlEvaluationComponent implements OnInit {

  controlGroups: ControlGroup[] = [];

  loading = false;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  constructor(
    private controlEvaluationService: ControlEvaluationService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {

    this.getTheme();
    this.initMenuName();
    this.get();
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
      headerTitle: 'ControlEvaluation',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'ControlEvaluation',
            isLink: false,
            link: '#'
          },
          {
            name: 'ControlEvaluation',
            isLink: false
          }
        ]
      }
    }
  }



  get() {
    this.loading = true;
    this.controlEvaluationService.getAllByStandardIdByEvaluationId(this.standardId, this.evaluationId)
      .subscribe((res: any) => {

        this.controlGroups = res.data;

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }



  add(control: Control) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddControlEvaluationComponent, {
        height: '780px',
        width: '780px',
        autoFocus: false,
        data: {
          controlId: control.controlId,
          controlName: control.name,
          numeration: control.numerationToShow,
          standardId: this.standardId,
          evaluationId: this.evaluationId,
        },
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.get();
      });
    }

  }

  edit(controlEvaluation: ControlEvaluation, control: Control) {
     if (controlEvaluation.controlEvaluationId == 0)
       this.add(control);
     else {

      if (this.loginService.isAuthenticated()) {
        let dialogRef = this.dialog.open(EditControlEvaluationComponent, {
          height: '780px',
          width: '780px',
          data: {
            _id: controlEvaluation.controlEvaluationId,
            standardId: this.standardId,
            controlName: controlEvaluation.control.name,
            numeration: controlEvaluation.control.numerationToShow,
          },
          autoFocus: false,
          panelClass: this.panelClass
        });

        dialogRef.afterClosed().subscribe(data => {
          if (data == null)
            return;

          if (data.updated == true)
            this.get();
        });
      }

     }


  }

  delete(controlEvaluation: ControlEvaluation, deleted: boolean) {

    let text: string;
    if (deleted)
      text = '¿Esta seguro de eliminar la controlEvaluation ' + controlEvaluation.value + '?';

    Swal.fire({
      title: 'Confirmación',
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        this.controlEvaluationService.delete(Number(controlEvaluation.controlEvaluationId))
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }

}
