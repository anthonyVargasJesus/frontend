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
import { GapRoutingModule } from './gap-routing.module';
import { ControlEvaluationComponent } from './control-evaluation/control-evaluation.component';
import { CurrentRequirementEvaluationComponent } from './current-requirement-evaluation/current-requirement-evaluation.component';
import { CurrentControlEvaluationComponent } from './current-control-evaluation/current-control-evaluation.component';
import { AddControlEvaluationComponent } from './control-evaluation/add-control-evaluation/add-control-evaluation.component';
import { EditControlEvaluationComponent } from './control-evaluation/edit-control-evaluation/edit-control-evaluation.component';
import { EditRequirementEvaluationComponent } from './requirement-evaluation/edit-requirement-evaluation/edit-requirement-evaluation.component';
import { AddRequirementEvaluationComponent } from './requirement-evaluation/add-requirement-evaluation/add-requirement-evaluation.component';
import { RequirementEvaluationComponent } from './requirement-evaluation/requirement-evaluation.component';
import { GapHomeComponent } from './gap-home/gap-home.component';
import { CustomRequirementEvaluationComponent } from './custom-requirement-evaluation/custom-requirement-evaluation.component';
import { CustomRequirementComponent } from './custom-requirement/custom-requirement.component';
import { MatIconModule } from '@angular/material/icon';
import { ReferenceDocumentationInStorageComponent } from './reference-documentation-in-storage/reference-documentation-in-storage.component';
import { AddReferenceDocumentationInStorageComponent } from './reference-documentation-in-storage/add-reference-documentation-in-storage/add-reference-documentation-in-storage.component';
import { EditReferenceDocumentationInStorageComponent } from './reference-documentation-in-storage/edit-reference-documentation-in-storage/edit-reference-documentation-in-storage.component';
import { ReferenceDocumentationByRequirementEvaluationComponent } from './reference-documentation-by-requirement-evaluation/reference-documentation-by-requirement-evaluation.component';
import { AddReferenceDocumentationComponent } from './reference-documentation-by-requirement-evaluation/add-reference-documentation/add-reference-documentation.component';
import { AddFileToFirebaseComponent } from './reference-documentation-in-storage/add-file-to-firebase/add-file-to-firebase.component';
import { EditReferenceDocumentationComponent } from './reference-documentation-by-requirement-evaluation/edit-reference-documentation/edit-reference-documentation.component';
import { IndicatorsComponent } from './evaluation-process/indicators/indicators.component';
import { Indicators2Component } from './evaluation-process/indicators2/indicators2.component';
import { Indicators3Component } from './evaluation-process/indicators3/indicators3.component';
import { Indicators4Component } from './evaluation-process/indicators4/indicators4.component';
import { DashboardComponent } from './evaluation-process/dashboard/dashboard.component';
import { ControlDashboardComponent } from './evaluation-process/control-dashboard/control-dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HomeComponent } from './evaluation-process/resumen/home.component';
import { RadarChartComponent } from './evaluation-process/radar-chart/radar-chart.component';
import { HeaderChartComponent } from './evaluation-process/header-chart/header-chart.component';
import { BreachByEvaluationComponent } from './breach-by-evaluation/breach-by-evaluation.component';
import { AddBreachByEvaluationComponent } from './breach-by-evaluation/add-breach-by-evaluation/add-breach-by-evaluation.component';
import { EditBreachByEvaluationComponent } from './breach-by-evaluation/edit-breach-by-evaluation/edit-breach-by-evaluation.component';
import { CurrentBreachsComponent } from './current-breachs/current-breachs.component';
import { MatRadioModule } from '@angular/material/radio';
import { RequirementNodeComponent } from './requirement-node/requirement-node.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PopupRequirementsComponent } from './popup-requirements/popup-requirements.component';
import { PopupControlsComponent } from './popup-controls/popup-controls.component';
import { ControlNodeComponent } from './control-node/control-node.component';

@NgModule({
  declarations: [
        ControlEvaluationComponent, CurrentRequirementEvaluationComponent, CurrentControlEvaluationComponent,
        CustomRequirementEvaluationComponent, CustomRequirementComponent,
        RequirementEvaluationComponent, AddRequirementEvaluationComponent,AddControlEvaluationComponent, 
        EditControlEvaluationComponent,EditRequirementEvaluationComponent, GapHomeComponent,
        ReferenceDocumentationInStorageComponent,
        AddReferenceDocumentationInStorageComponent, AddFileToFirebaseComponent, 
        EditReferenceDocumentationInStorageComponent, ReferenceDocumentationByRequirementEvaluationComponent,
        AddReferenceDocumentationComponent,EditReferenceDocumentationComponent,
        IndicatorsComponent, Indicators2Component, Indicators3Component, 
        Indicators4Component,DashboardComponent, ControlDashboardComponent,
        HomeComponent,
        RadarChartComponent,
        HeaderChartComponent, BreachByEvaluationComponent,AddBreachByEvaluationComponent, EditBreachByEvaluationComponent, CurrentBreachsComponent, RequirementNodeComponent, PopupRequirementsComponent, PopupControlsComponent, ControlNodeComponent
  ],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    GapRoutingModule,
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


export class GapModule { }
