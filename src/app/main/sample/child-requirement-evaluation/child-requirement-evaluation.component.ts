import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Requirement } from 'app/models/requirement';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';
import { LoginService } from 'app/services/login.service';
import { AddRequirementEvaluationComponent } from '../requirement-evaluation/add-requirement-evaluation/add-requirement-evaluation.component';
import { EditRequirementEvaluationComponent } from '../requirement-evaluation/edit-requirement-evaluation/edit-requirement-evaluation.component';

@Component({
  selector: 'app-child-requirement-evaluation',
  templateUrl: './child-requirement-evaluation.component.html',
  styles: [
  ]
})
export class ChildRequirementEvaluationComponent implements OnInit {

  @Input()
  requirementEvaluations: RequirementEvaluation[] = [];

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  @Input()
  panelClass: string;

  @Output() updateEvent = new EventEmitter<string>();

  constructor(private loginService: LoginService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  add(requirement: Requirement) {

    if (this.loginService.isAuthenticated()) {
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
    if (requirementEvaluation.requirementEvaluationId == 0)
      this.add(requirementEvaluation.requirement);
    else {

      if (this.loginService.isAuthenticated()) {
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

          if (data.updated == true)
            this.updateEvent.emit();

        });
      }

    }


  }


}
