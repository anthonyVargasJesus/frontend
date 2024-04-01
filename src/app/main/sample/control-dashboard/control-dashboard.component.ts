import { Component, Input, OnInit } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { ControlGroup } from 'app/models/control-group';
import { MaturityLevel } from 'app/models/maturity-level';
import { Requirement } from 'app/models/requirement';
import { EvaluationService } from 'app/services/evaluation.service';


@Component({
  selector: 'app-control-dashboard',
  templateUrl: './control-dashboard.component.html',
  styles: [
  ]
})
export class ControlDashboardComponent implements OnInit {

  maturityLevels: MaturityLevel[] = [];
  controlGroups: ControlGroup[] = [];
  total: number = 0;
  pieControlDashboardControlGroup: any ;
  bartVerticalDashboardControlGroupDto: any;

  colorScheme : any;

  loading = false;

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  @Input()
  standardName: string;
  
  constructor(private evaluationService: EvaluationService,) { }

  ngOnInit(): void {
    this.getDashboard();
  }

  getDashboard() {
    this.loading = true;
    this.evaluationService.getControlDashboard(this.standardId, this.evaluationId)
      .subscribe((res: any) => {
        
        this.maturityLevels = res.maturityLevels;
        this.controlGroups = res.controlGroups;
        this.total = res.value;
        
         this.pieControlDashboardControlGroup = res.pieControlDashboardControlGroup;
        this.bartVerticalDashboardControlGroupDto = res.bartVerticalDashboardControlGroupDto;

        console.log(res);
        
        this.colorScheme = {
          domain: res.colors
        };

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

}
