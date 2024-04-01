import { Component, Input, OnInit } from '@angular/core';
import { RequirementEvaluation } from 'app/models/requirement-evaluation';

@Component({
  selector: 'app-table-requirements-evaluation',
  templateUrl: './table-requirements-evaluation.component.html',
  styleUrls: ['./table-requirements-evaluation.component.scss']
})
export class TableRequirementsEvaluationComponent implements OnInit {

  @Input()
  requirementEvaluations: RequirementEvaluation[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log('r', this.requirementEvaluations);
  }

  edit(requirementEvaluation: RequirementEvaluation){

  }
  
}
