import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { Evaluation } from 'app/models/evaluation';
import { EvaluationService } from 'app/services/evaluation.service';

@Component({
  selector: 'app-evaluation-process',
  templateUrl: './evaluation-process.component.html',
  styles: [
  ]
})

export class EvaluationProcessComponent implements OnInit {


  public contentHeader: object;
  evaluation: Evaluation = new Evaluation();

  constructor(
    private evaluationService: EvaluationService,
    private route: ActivatedRoute,
    public router: Router,
  ) { }


  loading = false;
  loading2 = false;
  evaluationId: string;

  public submitted = false;
  standardId: string = '';

  standardName: string = '';

  ngOnInit(): void {

    this.initMenuName();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.evaluationId = params.get('id').toString();
      this.obtain(this.evaluationId);
    });

  }


  obtain(id: string) {
    this.loading = true;
    this.evaluationService.obtain(id)
      .subscribe((res: any) => {
        this.evaluation = res.data;
        if (this.evaluation)
        if (this.evaluation.standard)
          this.standardName = this.evaluation.standard.name;
        
        this.standardId = this.evaluation.standardId.toString();
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Normas',
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
            name: 'Normas',
            isLink: false
          },
          {
            name: 'ISO 27001',
            isLink: false
          }
        ]
      }
    }
  }





  save() {


  } 
  
  navigateToBack() {
    this.router.navigate(['/evaluation-process-list']);
  }

}
