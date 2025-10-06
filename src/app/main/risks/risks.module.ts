import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { RisksRoutingModule } from './risks-routing.module';
import { RisksIdentificationComponent } from './risks-identification/risks-identification.component';
import { RiskByEvaluationComponent } from './risk-by-evaluation/risk-by-evaluation.component';
import { AddRiskByEvaluationComponent } from './risk-by-evaluation/add-risk-by-evaluation/add-risk-by-evaluation.component';
import { EditRiskByEvaluationComponent } from './risk-by-evaluation/edit-risk-by-evaluation/edit-risk-by-evaluation.component';
import { CurrentRiskEvaluationComponent } from './current-risk-evaluation/current-risk-evaluation.component';
import { AddRiskAssessmentByRiskComponent } from './risk-assessment-by-risk/add-risk-assessment-by-risk/add-risk-assessment-by-risk.component';
import { EditRiskAssessmentByRiskComponent } from './risk-assessment-by-risk/edit-risk-assessment-by-risk/edit-risk-assessment-by-risk.component';
import { AddRiskTreatmentByRiskComponent } from './risk-treatment-by-risk/add-risk-treatment-by-risk/add-risk-treatment-by-risk.component';
import { EditRiskTreatmentByRiskComponent } from './risk-treatment-by-risk/edit-risk-treatment-by-risk/edit-risk-treatment-by-risk.component';
import { AddControlImplementationByRiskComponent } from './control-implementation-by-risk/add-control-implementation-by-risk/add-control-implementation-by-risk.component';
import { EditControlImplementationByRiskComponent } from './control-implementation-by-risk/edit-control-implementation-by-risk/edit-control-implementation-by-risk.component';

@NgModule({
  declarations: [
    RisksIdentificationComponent,RiskByEvaluationComponent, AddRiskByEvaluationComponent, EditRiskByEvaluationComponent, CurrentRiskEvaluationComponent,
    AddRiskAssessmentByRiskComponent, EditRiskAssessmentByRiskComponent, AddRiskTreatmentByRiskComponent, EditRiskTreatmentByRiskComponent,
        AddControlImplementationByRiskComponent, EditControlImplementationByRiskComponent,
  ],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    RisksRoutingModule,
    ContentHeaderModule,
    TranslateModule,
    CoreCommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatIconModule,
    NgbModule,
    NgxChartsModule,
    MatRadioModule,
    MatExpansionModule
  ]
})


export class RisksModule { }
