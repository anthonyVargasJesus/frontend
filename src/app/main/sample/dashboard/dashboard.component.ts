import { Component, Input, OnInit } from '@angular/core';
import { ErrorManager } from 'app/errors/error-manager';
import { MaturityLevel } from 'app/models/maturity-level';
import { Requirement } from 'app/models/requirement';
import { EvaluationService } from 'app/services/evaluation.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})


export class DashboardComponent implements OnInit {

  maturityLevels: MaturityLevel[] = [];
  requirements: Requirement[] = [];
  total: number = 0;
  pieDashboardRequirementDto: any ;
  bartVerticalDashboardRequirementDto: any;

  colorScheme : any;

  loading = false;
  loadingExcel = false;

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
    this.evaluationService.getDashboard(this.standardId, this.evaluationId)
      .subscribe((res: any) => {
        
        this.maturityLevels = res.maturityLevels;
        this.requirements = res.requirements;
        this.total = res.value;
        
        this.pieDashboardRequirementDto = res.pieDashboardRequirementDto;
        this.bartVerticalDashboardRequirementDto = res.bartVerticalDashboardRequirementDto;
 
        this.colorScheme = {
          domain: res.colors
        };

        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  public downloadExcel(): any {

    this.loadingExcel = true;
    var fileName = 'dashboard.xlsx';
    var mediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    this.evaluationService.getExcelDashboard(this.standardId.toString(), this.evaluationId.toString())
      .subscribe(res => {
        this.loadingExcel = false;

        var blob = new Blob([res], { type: mediaType });
        saveAs(blob, fileName);

      }, error => {
        this.loadingExcel = false;
        ErrorManager.handleError(error);
      });

  }

}
