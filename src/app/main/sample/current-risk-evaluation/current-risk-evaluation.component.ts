import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { Evaluation } from 'app/models/evaluation';
import { EvaluationService } from 'app/services/evaluation.service';

@Component({
  selector: 'app-current-risk-evaluation',
  templateUrl: './current-risk-evaluation.component.html',
  styles: [
  ]
})
export class CurrentRiskEvaluationComponent implements OnInit {

  standardId: number = 0;
  evaluationId: number = 0;
  loading = false;
  evaluation: Evaluation = new Evaluation();
  public contentHeader: object;
  title = '';

  constructor(private evaluationService: EvaluationService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.getCurrent();
  }
  
  getCurrent() {
    this.loading = true;
    this.evaluationService.getCurrent()
      .subscribe((res: any) => {
        this.evaluation = res.data;

        this.standardId = this.evaluation.standardId;
        this.evaluationId =  this.evaluation.evaluationId;
        this.title = this.evaluation.description;
        this.loading = false;
        this.initMenuName();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  initMenuName() {

    let title = '';
    if (this.evaluation)
      title = this.evaluation.description;

    this.contentHeader = {
      headerTitle: 'Evaluación de riesgos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'EVALUACIÓN',
            isLink: false,
            link: '#'
          },
          {
            name: 'Riesgos',
            isLink: false
          },
        ]
      }
    }
  }

}
