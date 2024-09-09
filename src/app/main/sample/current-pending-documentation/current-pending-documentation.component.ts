import { Component, OnInit } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { Evaluation } from 'app/models/evaluation';
import { EvaluationService } from 'app/services/evaluation.service';

@Component({
  selector: 'app-current-pending-documentation',
  templateUrl: './current-pending-documentation.component.html',
  styles: [
  ]
})

export class CurrentPendingDocumentationComponent implements OnInit {

  standardId: number = 0;
  evaluationId: number = 0;
  loading = false;
  evaluation: Evaluation = new Evaluation();
  public contentHeader: object;
  title = '';

  constructor(private evaluationService: EvaluationService) { }

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
      headerTitle: 'Pendientes',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'DOCUMENTACIÓN',
            isLink: false,
            link: '#'
          },
          {
            name: 'Pendientes',
            isLink: false
          },
        ]
      }
    }
  }

}
