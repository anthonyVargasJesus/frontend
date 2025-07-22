import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoreConfigService } from '@core/services/config.service';
import { AddRequirementEvaluationComponent } from 'app/main/sample/requirement-evaluation/add-requirement-evaluation/add-requirement-evaluation.component';
import { EditRequirementEvaluationComponent } from 'app/main/sample/requirement-evaluation/edit-requirement-evaluation/edit-requirement-evaluation.component';
import { Requirement } from 'app/models/requirement';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { LoginService } from 'app/services/login.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-custom-requirement-evaluation',
  templateUrl: './custom-requirement-evaluation.component.html',
  styleUrls: ['./custom-requirement-evaluation.component.scss']
})
export class CustomRequirementEvaluationComponent implements OnInit {

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  @Input()
  requirementEvaluation: RequirementEvaluation;


  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  coreConfig: any;

  @Output() updateEvent = new EventEmitter<string>();

  constructor(private _coreConfigService: CoreConfigService,
    private _loginService: LoginService,
    private dialog: MatDialog) {
    this._unsubscribeAll = new Subject();
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnInit(): void {

  }



  add(requirement: Requirement) {

    if (this._loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddRequirementEvaluationComponent, {
        height: '780px',
        width: '780px',
        autoFocus: false,
        data: {
          requirementId: requirement.requirementId,
          requirementName: requirement.name,
          numeration: requirement.numerationToShow,
          standardId: this.standardId,
          evaluationId: this.evaluationId,
        },
        panelClass: this.panelClass
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == null)
          return;

        if (data.updated == true)
          this.updateEvent.emit();
      });
    }

  }


  edit(requirementEvaluation: RequirementEvaluation) {

    console.log(this.standardId);

    if (requirementEvaluation.requirementEvaluationId == 0)
      this.add(requirementEvaluation.requirement);
    else {

      if (this._loginService.isAuthenticated()) {
        let dialogRef = this.dialog.open(EditRequirementEvaluationComponent, {
          height: '780px',
          width: '780px',
          data: {
            _id: requirementEvaluation.requirementEvaluationId,
            standardId: this.standardId,
            requirementName: requirementEvaluation.requirement.name,
            numeration: requirementEvaluation.requirement.numerationToShow,
          },
          autoFocus: false,
          panelClass: this.panelClass
        });

        dialogRef.afterClosed().subscribe(data => {
          if (data == null)
            return;

          // if (data.updated == true)
          //   this.updateEvent.emit();

        });
      }

    }


  }

  getBadgeColor(state: string): string {
    switch (state) {
      case 'Cumplido': return '#4CAF50'; // verde
      case 'Pendiente': return '#FFC107'; // amarillo
      case 'No cumplido': return '#F44336'; // rojo
      default: return '#000000'; // negro por defecto
    }
  }


}
