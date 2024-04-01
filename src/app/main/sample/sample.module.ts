import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { SampleComponent } from './sample.component';
import { HomeComponent } from './home.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CoreSidebarModule } from '@core/components';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';

import { MatMenuModule } from '@angular/material/menu';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StandardComponent } from './standard/standard.component';
import { AddStandardComponent } from './standard/add-standard/add-standard.component';
import { EditStandardComponent } from './standard/edit-standard/edit-standard.component';
import { RequirementComponent } from './requirement/requirement.component';
import { AddRequirementComponent } from './requirement/add-requirement/add-requirement.component';
import { EditRequirementComponent } from './requirement/edit-requirement/edit-requirement.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { AddDocumentationComponent } from './documentation/add-documentation/add-documentation.component';
import { EditDocumentationComponent } from './documentation/edit-documentation/edit-documentation.component';
import { ControlComponent } from './control/control.component';
import { ControlTypeComponent } from './control-type/control-type.component';
import { AddControlTypeComponent } from './control-type/add-control-type/add-control-type.component';
import { EditControlTypeComponent } from './control-type/edit-control-type/edit-control-type.component';
import { EditControlComponent } from './control/edit-control/edit-control.component';
import { AddControlComponent } from './control/add-control/add-control.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ResponsibleComponent } from './responsible/responsible.component';
import { AddResponsibleComponent } from './responsible/add-responsible/add-responsible.component';
import { EditResponsibleComponent } from './responsible/edit-responsible/edit-responsible.component';
import { MaturityLevelComponent } from './maturity-level/maturity-level.component';
import { AddMaturityLevelComponent } from './maturity-level/add-maturity-level/add-maturity-level.component';
import { EditMaturityLevelComponent } from './maturity-level/edit-maturity-level/edit-maturity-level.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { AddIndicatorComponent } from './indicator/add-indicator/add-indicator.component';
import { EditIndicatorComponent } from './indicator/edit-indicator/edit-indicator.component';
import { EvaluationAdminComponent } from './evaluation-admin/evaluation-admin.component';
import { AddEvaluationAdminComponent } from './evaluation-admin/add-evaluation-admin/add-evaluation-admin.component';
import { EditEvaluationAdminComponent } from './evaluation-admin/edit-evaluation-admin/edit-evaluation-admin.component';
import { EvaluationProcessListComponent } from './evaluation-process-list/evaluation-process-list.component';
import { EvaluationProcessComponent } from './evaluation-process/evaluation-process.component';
import { RequirementProcessComponent } from './evaluation-process/requirement-process/requirement-process.component';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ControlProcessComponent } from './evaluation-process/control-process/control-process.component';
import { IndicatorsComponent } from './evaluation-process/indicators/indicators.component';
import { Indicators2Component } from './evaluation-process/indicators2/indicators2.component';
import { Indicators3Component } from './evaluation-process/indicators3/indicators3.component';
import { Indicators4Component } from './evaluation-process/indicators4/indicators4.component';
import { DemoComponent } from './demo/demo.component';
import { DemoDetalleComponent } from './demo-detalle/demo-detalle.component';
import { DemoDetalleRepairsComponent } from './demo-detalle-repairs/demo-detalle-repairs.component';
import { RequirementDocumentationComponent } from './requirement-documentation/requirement-documentation.component';
import { RequirementEvaluationComponent } from './requirement-evaluation/requirement-evaluation.component';
import { AddRequirementEvaluationComponent } from './requirement-evaluation/add-requirement-evaluation/add-requirement-evaluation.component';
import { TableRequirementsEvaluationComponent } from './table-requirements-evaluation/table-requirements-evaluation.component';
import { EditRequirementEvaluationComponent } from './requirement-evaluation/edit-requirement-evaluation/edit-requirement-evaluation.component';
import { ControlEvaluationComponent } from './control-evaluation/control-evaluation.component';
import { AddControlEvaluationComponent } from './control-evaluation/add-control-evaluation/add-control-evaluation.component';
import { EditControlEvaluationComponent } from './control-evaluation/edit-control-evaluation/edit-control-evaluation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlDashboardComponent } from './control-dashboard/control-dashboard.component';

 FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);
//FullCalendarModule.registerPlugins([timeGridPlugin, listPlugin, interactionPlugin]);

const routes = [
  {
    path: 'sample',
    component: SampleComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  },
  {
    path: 'standard',
    component: StandardComponent,
    data: { animation: 'standard' }
  },
  {
    path: 'edit-standard/:id',
    component: EditStandardComponent,
    data: { animation: 'edit-standard' }
  },
  {
    path: 'maturity-level',
    component: MaturityLevelComponent,
    data: { animation: 'maturity-level' }
  },
  {
    path: 'indicator',
    component: IndicatorComponent,
    data: { animation: 'indicator' }
  },
  {
    path: 'evaluation-admin',
    component: EvaluationAdminComponent,
    data: { animation: 'evaluation-admin' }
  },
  {
    path: 'evaluation-process-list',
    component: EvaluationProcessListComponent,
    data: { animation: 'evaluation-process-list' }
  },
  {
    path: 'evaluation-process/:id',
    component: EvaluationProcessComponent,
    data: { animation: 'evaluation-process' }
  },
  {
    path: 'demo',
    component: DemoComponent,
    data: { animation: 'demo' }
  },
  {
    path: 'demo-detalle',
    component: DemoDetalleComponent,
    data: { animation: 'demo-detalle' }
  },
];

@NgModule({
  declarations: [SampleComponent, HomeComponent, StandardComponent, AddStandardComponent, EditStandardComponent, RequirementComponent, AddRequirementComponent, EditRequirementComponent, DocumentationComponent, AddDocumentationComponent, EditDocumentationComponent, ControlComponent, ControlTypeComponent, AddControlTypeComponent, EditControlTypeComponent, EditControlComponent, AddControlComponent, ResponsibleComponent, AddResponsibleComponent, EditResponsibleComponent, MaturityLevelComponent, AddMaturityLevelComponent, EditMaturityLevelComponent, IndicatorComponent, AddIndicatorComponent, EditIndicatorComponent, EvaluationAdminComponent, AddEvaluationAdminComponent, EditEvaluationAdminComponent, EvaluationProcessListComponent, EvaluationProcessComponent, RequirementProcessComponent, ControlProcessComponent, IndicatorsComponent, Indicators2Component, Indicators3Component, Indicators4Component, DemoComponent, DemoDetalleComponent, DemoDetalleRepairsComponent, RequirementDocumentationComponent, RequirementEvaluationComponent, AddRequirementEvaluationComponent, TableRequirementsEvaluationComponent, EditRequirementEvaluationComponent, ControlEvaluationComponent, AddControlEvaluationComponent, EditControlEvaluationComponent, DashboardComponent, ControlDashboardComponent],
  imports: [
    RouterModule.forChild(routes), 
    ContentHeaderModule, 
    TranslateModule, 
    CoreCommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    FullCalendarModule,
    CoreSidebarModule,
    NgbModule,
    NgxChartsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatFormFieldModule, 
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  exports: [SampleComponent, HomeComponent],

})
export class SampleModule {}
