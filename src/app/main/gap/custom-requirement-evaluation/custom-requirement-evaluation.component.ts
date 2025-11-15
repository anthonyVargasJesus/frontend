import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Requirement } from 'app/models/requirement';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { LoginService } from 'app/services/login.service';
import { AddRequirementEvaluationComponent } from '../requirement-evaluation/add-requirement-evaluation/add-requirement-evaluation.component';
import { EditRequirementEvaluationComponent } from '../requirement-evaluation/edit-requirement-evaluation/edit-requirement-evaluation.component';


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

  @Input()
  panelClass: string;

  @Input()
  isSearch: boolean

  @Output() updateEvent = new EventEmitter<string>();

  constructor(
    private _loginService: LoginService,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {

  }

  add(requirement: Requirement) {

    if (this._loginService.isAuthenticated()) {
      let dialogRef = this.dialog.open(AddRequirementEvaluationComponent, {
        height: '790px',
        width: '780px',
        autoFocus: false,
        data: {
          requirementId: requirement.requirementId,
          requirementName: requirement.name,
          numeration: requirement.numerationToShow,
          standardId: this.standardId,
          evaluationId: this.evaluationId,
          panelClass: this.panelClass,
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

    if (requirementEvaluation.requirementEvaluationId == 0)
      this.add(requirementEvaluation.requirement);
    else {

      if (this._loginService.isAuthenticated()) {
        let dialogRef = this.dialog.open(EditRequirementEvaluationComponent, {
          height: '790px',
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

          if (data.updated == true)
            this.updateEvent.emit();
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
