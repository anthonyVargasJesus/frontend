import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { EditRequirementComponent } from './edit-requirement/edit-requirement.component';
import { Requirement } from 'app/models/requirement';
import { MatAccordion } from '@angular/material/expansion';
import { Subject } from 'rxjs';
import { RequirementService } from 'app/services/requirement.service';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import Swal from 'sweetalert2';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoginModel } from 'app/models/login-model';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styles: [
  ]
})
export class RequirementComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;


  requirements: Requirement[] = [];
  loading = false;
  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  @Input()
  standardId: number;

  currentLoginModel: LoginModel = new LoginModel();
  coreConfig: any;

  constructor(
    private requirementService: RequirementService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.currentLoginModel = this.loginService.getCurrentUser();


    this.getTheme();
    this.initMenuName();

    if (this.standardId == undefined) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.standardId = Number(params.get('id').toString());
        this.get();
      });
    } else
      this.get();

  }

  expandAll() {
    this.accordion.openAll();
  }

  collapseAll() {
    this.accordion.closeAll();
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
      headerTitle: 'Requisitos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.currentLoginModel.cs,
            isLink: false,
            link: '#'
          },
          {
            name: 'Requisitos',
            isLink: false
          },
        ]
      }
    }
  }


  get() {
    this.loading = true;
    this.requirementService.get(this.standardId)
      .subscribe((res: any) => {
        console.log(res);
        this.asignObjects(res);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  edit(id: number) {

    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(EditRequirementComponent, {
        height: '700px',
        width: '700px',
        data: {
          _id: id,
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

  delete(requirement: Requirement) {

    let text: string;
    text = '¿Esta seguro de eliminar el requisito: ' + requirement.name + '?';

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

        this.requirementService.delete(requirement.requirementId.toString())
          .subscribe(deleted => {
            this.get();
          });

      }
    })

  }



  asignObjects(res) {
    this.requirements = res.data;
  }

  addChild(requirementId: number, level: number) {
    if (this.loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddRequirementComponent, {
        height: '700px',
        width: '700px',
        autoFocus: false,
        data: {
          requirementId: requirementId,
          level: level,
          standardId: this.standardId
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
}
