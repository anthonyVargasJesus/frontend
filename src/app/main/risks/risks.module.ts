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
import { RiskToEvaluationComponent } from './risk-to-evaluation/risk-to-evaluation.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RiskToTreatmentComponent } from './risk-to-treatment/risk-to-treatment.component';
import { RiskToControlComponent } from './risk-to-control/risk-to-control.component';
import { ControlImplementationByRiskComponent } from './control-implementation-by-risk/control-implementation-by-risk.component';
import { AcceptRiskComponent } from './accept-risk/accept-risk.component';
import { ScalateRiskComponent } from './scalate-risk/scalate-risk.component';
import { FollowUpRiskComponent } from './follow-up-risk/follow-up-risk.component';
import { ReopenRiskComponent } from './reopen-risk/reopen-risk.component';
import { MenaceTypeComponent } from './menace-type/menace-type.component';
import { AddMenaceTypeComponent } from './menace-type/add-menace-type/add-menace-type.component';
import { EditMenaceTypeComponent } from './menace-type/edit-menace-type/edit-menace-type.component';
import { MenaceComponent } from './menace/menace.component';
import { AddMenaceComponent } from './menace/add-menace/add-menace.component';
import { EditMenaceComponent } from './menace/edit-menace/edit-menace.component';
import { VulnerabilityTypeComponent } from './vulnerability-type/vulnerability-type.component';
import { AddVulnerabilityTypeComponent } from './vulnerability-type/add-vulnerability-type/add-vulnerability-type.component';
import { EditVulnerabilityTypeComponent } from './vulnerability-type/edit-vulnerability-type/edit-vulnerability-type.component';
import { VulnerabilityComponent } from './vulnerability/vulnerability.component';
import { AddVulnerabilityComponent } from './vulnerability/add-vulnerability/add-vulnerability.component';
import { EditVulnerabilityComponent } from './vulnerability/edit-vulnerability/edit-vulnerability.component';
import { ResidualRiskComponent } from './residual-risk/residual-risk.component';
import { AddResidualRiskComponent } from './residual-risk/add-residual-risk/add-residual-risk.component';
import { EditResidualRiskComponent } from './residual-risk/edit-residual-risk/edit-residual-risk.component';
import { RiskTreatmentMethodComponent } from './risk-treatment-method/risk-treatment-method.component';
import { AddRiskTreatmentMethodComponent } from './risk-treatment-method/add-risk-treatment-method/add-risk-treatment-method.component';
import { EditRiskTreatmentMethodComponent } from './risk-treatment-method/edit-risk-treatment-method/edit-risk-treatment-method.component';
import { RiskLevelComponent } from './risk-level/risk-level.component';
import { AddRiskLevelComponent } from './risk-level/add-risk-level/add-risk-level.component';
import { EditRiskLevelComponent } from './risk-level/edit-risk-level/edit-risk-level.component';


@NgModule({
  declarations: [
    RisksIdentificationComponent, RiskByEvaluationComponent, AddRiskByEvaluationComponent, EditRiskByEvaluationComponent, CurrentRiskEvaluationComponent,
    AddRiskAssessmentByRiskComponent, EditRiskAssessmentByRiskComponent, AddRiskTreatmentByRiskComponent, EditRiskTreatmentByRiskComponent,
    AddControlImplementationByRiskComponent, EditControlImplementationByRiskComponent, RiskToEvaluationComponent,
     RiskToTreatmentComponent, RiskToControlComponent, ControlImplementationByRiskComponent, AcceptRiskComponent, ScalateRiskComponent, FollowUpRiskComponent, ReopenRiskComponent,
    MenaceTypeComponent, AddMenaceTypeComponent, EditMenaceTypeComponent,
    MenaceComponent, AddMenaceComponent, EditMenaceComponent,
    VulnerabilityTypeComponent, AddVulnerabilityTypeComponent, EditVulnerabilityTypeComponent,
    VulnerabilityComponent, AddVulnerabilityComponent, EditVulnerabilityComponent,
    ResidualRiskComponent, AddResidualRiskComponent, EditResidualRiskComponent,
    RiskLevelComponent, AddRiskLevelComponent, EditRiskLevelComponent,
    RiskTreatmentMethodComponent, AddRiskTreatmentMethodComponent, EditRiskTreatmentMethodComponent,
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
    MatExpansionModule,
    MatSnackBarModule,
  ]
})


export class RisksModule { }
