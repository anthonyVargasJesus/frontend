import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Requirement } from 'app/models/requirement';
import { Subject } from 'rxjs';
import { RequirementService } from 'app/services/requirement.service';
import { LoginService } from 'app/services/login.service';
import { CoreConfigService } from '@core/services/config.service';
import { getResults } from 'app/config/config';
import { takeUntil } from 'rxjs/operators';
import { ErrorManager } from 'app/errors/error-manager';
import { User } from 'app/models/user';
import { LoginModel } from 'app/models/login-model';


@Component({
  selector: 'app-requirement-process',
  templateUrl: './requirement-process.component.html',
  styles: [
  ]
})
export class RequirementProcessComponent implements OnInit {

  requirements: Requirement[] = [];
  selectedRow = 0;
  total = 0;
  loading = false;
  results: string;


  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;

  @Input()
  standardId: number;
  @Input()
  evaluationId: number;

  currentLoginModel: LoginModel = new LoginModel();
  
  constructor(
    private requirementService: RequirementService,
    private loginService: LoginService,
    private _coreConfigService: CoreConfigService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.currentLoginModel = this.loginService.getCurrentUser();
    console.log('currentLoginModel', this.currentLoginModel);
    this.getTheme();
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


  get() {

    this.loading = true;
    this.requirementService.get(this.standardId)
      .subscribe((res: any) => {
        this.asignObjects(res);
        this.results = getResults(this.total, 0);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }



  edit(id: number) {

   

  }



  delete(requirement: Requirement) {


  }


  asignObjects(res) {
    this.requirements = res.data;
    this.total = res.pagination.totalRows;
  }

  addChild(requirementId: number, level: number) {


  }


}
