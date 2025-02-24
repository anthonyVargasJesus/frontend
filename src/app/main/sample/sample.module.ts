import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CoreSidebarModule } from '@core/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxChartsModule } from '@swimlane/ngx-charts';

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
import { ControlGroupComponent } from './control-group/control-group.component';
import { EditControlComponent } from './control/edit-control/edit-control.component';
import { AddControlComponent } from './control/add-control/add-control.component';
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
import { ControlProcessComponent } from './evaluation-process/control-process/control-process.component';

import { IndicatorsComponent } from './evaluation-process/indicators/indicators.component';
import { Indicators2Component } from './evaluation-process/indicators2/indicators2.component';
import { Indicators3Component } from './evaluation-process/indicators3/indicators3.component';
import { Indicators4Component } from './evaluation-process/indicators4/indicators4.component';

// import { DemoComponent } from './demo/demo.component';
// import { DemoDetalleComponent } from './demo-detalle/demo-detalle.component';
// import { DemoDetalleRepairsComponent } from './demo-detalle-repairs/demo-detalle-repairs.component';
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
import { DocumentTypeComponent } from './document-type/document-type.component';
import { AddDocumentTypeComponent } from './document-type/add-document-type/add-document-type.component';
import { EditDocumentTypeComponent } from './document-type/edit-document-type/edit-document-type.component';
import { DefaultSectionComponent } from './default-section/default-section.component';
import { AddDefaultSectionComponent } from './default-section/add-default-section/add-default-section.component';
import { EditDefaultSectionComponent } from './default-section/edit-default-section/edit-default-section.component';
import { DocumentationManagerComponent } from './documentation-manager/documentation-manager.component';
import { VersionComponent } from './version/version.component';
import { AddVersionComponent } from './version/add-version/add-version.component';
import { EditVersionComponent } from './version/edit-version/edit-version.component';
import { EditDocumentationManagerComponent } from './documentation-manager/edit-documentation-manager/edit-documentation-manager.component';
import { SupportForRequirementComponent } from './support-for-requirement/support-for-requirement.component';
import { AddSupportForRequirementComponent } from './support-for-requirement/add-support-for-requirement/add-support-for-requirement.component';
import { EditSupportForRequirementComponent } from './support-for-requirement/edit-support-for-requirement/edit-support-for-requirement.component';
import { DocumentationSupportComponent } from './documentation-support/documentation-support.component';
import { EditDocumentationSupportComponent } from './documentation-support/edit-documentation-support/edit-documentation-support.component';
import { ConfidentialityLevelComponent } from './confidentiality-level/confidentiality-level.component';
import { AddConfidentialityLevelComponent } from './confidentiality-level/add-confidentiality-level/add-confidentiality-level.component';
import { EditConfidentialityLevelComponent } from './confidentiality-level/edit-confidentiality-level/edit-confidentiality-level.component';
import { SupportForControlComponent } from './support-for-control/support-for-control.component';
import { AddSupportForControlComponent } from './support-for-control/add-support-for-control/add-support-for-control.component';
import { EditSupportForControlComponent } from './support-for-control/edit-support-for-control/edit-support-for-control.component';
import { SectionComponent } from './section/section.component';
import { AddSectionComponent } from './section/add-section/add-section.component';
import { EditSectionComponent } from './section/edit-section/edit-section.component';
import { PersonalComponent } from './personal/personal.component';
import { AddPersonalComponent } from './personal/add-personal/add-personal.component';
import { EditPersonalComponent } from './personal/edit-personal/edit-personal.component';
import { CreatorComponent } from './creator/creator.component';
import { AddCreatorComponent } from './creator/add-creator/add-creator.component';
import { EditCreatorComponent } from './creator/edit-creator/edit-creator.component';
import { ReviewerComponent } from './reviewer/reviewer.component';
import { AddReviewerComponent } from './reviewer/add-reviewer/add-reviewer.component';
import { EditReviewerComponent } from './reviewer/edit-reviewer/edit-reviewer.component';
import { ApproverComponent } from './approver/approver.component';
import { AddApproverComponent } from './approver/add-approver/add-approver.component';
import { EditApproverComponent } from './approver/edit-approver/edit-approver.component';
import { MacroprocessComponent } from './macroprocess/macroprocess.component';
import { AddMacroprocessComponent } from './macroprocess/add-macroprocess/add-macroprocess.component';
import { EditMacroprocessComponent } from './macroprocess/edit-macroprocess/edit-macroprocess.component';
import { SubprocessComponent } from './subprocess/subprocess.component';
import { AddSubprocessComponent } from './subprocess/add-subprocess/add-subprocess.component';
import { EditSubprocessComponent } from './subprocess/edit-subprocess/edit-subprocess.component';
import { ActiveTypeComponent } from './active-type/active-type.component';
import { AddActiveTypeComponent } from './active-type/add-active-type/add-active-type.component';
import { EditActiveTypeComponent } from './active-type/edit-active-type/edit-active-type.component';

import { OwnerComponent } from './owner/owner.component';
import { AddOwnerComponent } from './owner/add-owner/add-owner.component';
import { EditOwnerComponent } from './owner/edit-owner/edit-owner.component';
import { CustodianComponent } from './custodian/custodian.component';
import { AddCustodianComponent } from './custodian/add-custodian/add-custodian.component';
import { EditCustodianComponent } from './custodian/edit-custodian/edit-custodian.component';
import { UsageClassificationComponent } from './usage-classification/usage-classification.component';
import { AddUsageClassificationComponent } from './usage-classification/add-usage-classification/add-usage-classification.component';
import { EditUsageClassificationComponent } from './usage-classification/edit-usage-classification/edit-usage-classification.component';
import { SupportTypeComponent } from './support-type/support-type.component';
import { AddSupportTypeComponent } from './support-type/add-support-type/add-support-type.component';
import { EditSupportTypeComponent } from './support-type/edit-support-type/edit-support-type.component';
import { LocationComponent } from './location/location.component';
import { AddLocationComponent } from './location/add-location/add-location.component';
import { EditLocationComponent } from './location/edit-location/edit-location.component';
import { ImpactValuationComponent } from './impact-valuation/impact-valuation.component';
import { AddImpactValuationComponent } from './impact-valuation/add-impact-valuation/add-impact-valuation.component';
import { EditImpactValuationComponent } from './impact-valuation/edit-impact-valuation/edit-impact-valuation.component';
import { ActivesInventoryComponent } from './actives-inventory/actives-inventory.component';
import { AddActivesInventoryComponent } from './actives-inventory/add-actives-inventory/add-actives-inventory.component';
import { EditActivesInventoryComponent } from './actives-inventory/edit-actives-inventory/edit-actives-inventory.component';
import { ValuationInActiveByActivesInventoryComponent } from './valuation-in-active-by-actives-inventory/valuation-in-active-by-actives-inventory.component';
import { AddValuationInActiveByActivesInventoryComponent } from './valuation-in-active-by-actives-inventory/add-valuation-in-active-by-actives-inventory/add-valuation-in-active-by-actives-inventory.component';
import { EditValuationInActiveByActivesInventoryComponent } from './valuation-in-active-by-actives-inventory/edit-valuation-in-active-by-actives-inventory/edit-valuation-in-active-by-actives-inventory.component';
import { OptionComponent } from './option/option.component';
import { AddOptionComponent } from './option/add-option/add-option.component';
import { EditOptionComponent } from './option/edit-option/edit-option.component';
import { MenuComponent } from './menu/menu.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { EditMenuComponent } from './menu/edit-menu/edit-menu.component';
import { RoleComponent } from './role/role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { OptionInMenuByMenuComponent } from './option-in-menu-by-menu/option-in-menu-by-menu.component';
import { AddOptionInMenuByMenuComponent } from './option-in-menu-by-menu/add-option-in-menu-by-menu/add-option-in-menu-by-menu.component';
import { EditOptionInMenuByMenuComponent } from './option-in-menu-by-menu/edit-option-in-menu-by-menu/edit-option-in-menu-by-menu.component';
import { MenuInRoleComponent } from './menu-in-role/menu-in-role.component';
import { UserStateComponent } from './user-state/user-state.component';
import { AddUserStateComponent } from './user-state/add-user-state/add-user-state.component';
import { EditUserStateComponent } from './user-state/edit-user-state/edit-user-state.component';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { HeaderUserComponent } from './user/header-user/header-user.component';
import { RoleInUserByUserComponent } from './role-in-user-by-user/role-in-user-by-user.component';
import { AddRoleInUserByUserComponent } from './role-in-user-by-user/add-role-in-user-by-user/add-role-in-user-by-user.component';
import { EditRoleInUserByUserComponent } from './role-in-user-by-user/edit-role-in-user-by-user/edit-role-in-user-by-user.component';
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


import { AddControlGroupComponent } from './control-group/add-control-group/add-control-group.component';
import { EditControlGroupComponent } from './control-group/edit-control-group/edit-control-group.component';


import { ControlTypeComponent } from './control-type/control-type.component';
import { AddControlTypeComponent } from './control-type/add-control-type/add-control-type.component';
import { EditControlTypeComponent } from './control-type/edit-control-type/edit-control-type.component';
import { RiskLevelComponent } from './risk-level/risk-level.component';
import { AddRiskLevelComponent } from './risk-level/add-risk-level/add-risk-level.component';
import { EditRiskLevelComponent } from './risk-level/edit-risk-level/edit-risk-level.component';
import { RiskComponent } from './risk/risk.component';
import { AddRiskComponent } from './risk/add-risk/add-risk.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { CurrentRequirementEvaluationComponent } from './current-requirement-evaluation/current-requirement-evaluation.component';
import { CurrentControlEvaluationComponent } from './current-control-evaluation/current-control-evaluation.component';
import { SectionByDocumentationIdComponent } from './section/section-by-documentation-id/section-by-documentation-id.component';
import { CurrentPendingDocumentationComponent } from './current-pending-documentation/current-pending-documentation.component';
import { PendingDocumentationComponent } from './pending-documentation/pending-documentation.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { AnnualSummaryComponent } from './annual-summary/annual-summary.component';

import { HomeComponent } from './home.component';


const routes = [

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
    path: 'edit-standard/:id/:id2',
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
  // {
  //   path: 'demo',
  //   component: DemoComponent,
  //   data: { animation: 'demo' }
  // },
  // {
  //   path: 'demo-detalle',
  //   component: DemoDetalleComponent,
  //   data: { animation: 'demo-detalle' }
  // },
  {
    path: 'document-type',
    component: DocumentTypeComponent,
    data: { animation: 'document-type' }
  },
  {
    path: 'edit-document-type/:id',
    component: EditDocumentTypeComponent,
    data: { animation: 'edit-document' }
  },
  {
    path: 'documentation-manager',
    component: DocumentationManagerComponent,
    data: { animation: 'document-manager' }
  },
  {
    path: 'edit-document-manager/:id/:id2',
    component: EditDocumentationManagerComponent,
    data: { animation: 'edit-document-manager' }
  },
  {
    path: 'supports',
    component: DocumentationSupportComponent,
    data: { animation: 'supports' }
  },
  {
    path: 'support-detail/:id',
    component: EditDocumentationSupportComponent,
    data: { animation: 'supports' }
  },
  {
    path: 'confidentiality-level',
    component: ConfidentialityLevelComponent,
    data: { animation: 'confidentiality-level' }
  },
  {
    path: 'personal',
    component: PersonalComponent,
    data: { animation: 'personal' }
  },
  {
    path: 'macroprocess',
    component: MacroprocessComponent,
    data: { animation: 'macroprocess' }
  },
  {
    path: 'subprocess',
    component: SubprocessComponent,
    data: { animation: 'subprocess' }
  },
  {
    path: 'active-type',
    component: ActiveTypeComponent,
    data: { animation: 'active-type' }
  },
  {
    path: 'owner',
    component: OwnerComponent,
    data: { animation: 'owner' }
  },
  {
    path: 'custodian',
    component: CustodianComponent,
    data: { animation: 'custodian' }
  },
  {
    path: 'usage-classification',
    component: UsageClassificationComponent,
    data: { animation: 'usage-classification' }
  },
  {
    path: 'support-type',
    component: SupportTypeComponent,
    data: { animation: 'support-type' }
  },
  {
    path: 'location',
    component: LocationComponent,
    data: { animation: 'location' }
  },
  {
    path: 'impact-valuation',
    component: ImpactValuationComponent,
    data: { animation: 'impact-valuation' }
  },
  {
    path: 'actives-inventory',
    component: ActivesInventoryComponent,
    data: { animation: 'actives-inventory' }
  },
  {
    path: 'add-actives-inventory',
    component: AddActivesInventoryComponent,
    data: { animation: 'add-actives-inventory' }
  },
  {
    path: 'edit-actives-inventory/:id',
    component: EditActivesInventoryComponent,
    data: { animation: 'edit-actives-inventory' }
  },
  {
    path: 'option',
    component: OptionComponent,
    data: { animation: 'option' }
  },
  {
    path: 'menu',
    component: MenuComponent,
    data: { animation: 'menu' }
  },
  {
    path: 'role',
    component: RoleComponent,
    data: { animation: 'role' }
  },
  {
    path: 'user-state',
    component: UserStateComponent,
    data: { animation: 'user-state' }
  },
  {
    path: 'user',
    component: UserComponent,
    data: { animation: 'user' }
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    data: { animation: 'edit-actives-inventory' }
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    data: { animation: 'edit-user' }
  },
  {
    path: 'menace-type',
    component: MenaceTypeComponent,
    data: { animation: 'menace-type' }
  },
  {
    path: 'menace',
    component: MenaceComponent,
    data: { animation: 'menace' }
  },
  {
    path: 'vulnerability-type',
    component: VulnerabilityTypeComponent,
    data: { animation: 'vulnerability-type' }
  },
  {
    path: 'vulnerability',
    component: VulnerabilityComponent,
    data: { animation: 'vulnerability' }
  },
  {
    path: 'control-type',
    component: ControlTypeComponent,
    data: { animation: 'control-type' }
  },
  {
    path: 'risk-level',
    component: RiskLevelComponent,
    data: { animation: 'risk-level' }
  },
  {
    path: 'risk',
    component: RiskComponent,
    data: { animation: 'risk' }
  },
  {
    path: 'annual-sumary',
    component: AnnualSummaryComponent,
    data: { animation: 'annual-sumary' }
  },
  {
    path: 'edit-company',
    component: EditCompanyComponent,
    data: { animation: 'edit-company' }
  },
  {
    path: 'requirement/:id',
    component: RequirementComponent,
    data: { animation: 'requirement' }
  },
  {
    path: 'control-group/:id',
    component: ControlGroupComponent,
    data: { animation: 'control-group' }
  },
  {
    path: 'responsible/:id',
    component: ResponsibleComponent,
    data: { animation: 'responsible' }
  },
  {
    path: 'documentation/:id',
    component: DocumentationComponent,
    data: { animation: 'documentation' }
  },
  {
    path: 'requirement-evaluation',
    component: CurrentRequirementEvaluationComponent,
    data: { animation: 'requirement-evaluation' }
  },
  {
    path: 'control-evaluation',
    component: CurrentControlEvaluationComponent,
    data: { animation: 'control-evaluation' }
  },
  {
    path: 'pending-documentation',
    component: CurrentPendingDocumentationComponent,
    data: { animation: 'pending-documentation' }
  },
  {
    path: 'edit-documentation/:id',
    component: EditDocumentationComponent,
    data: { animation: 'edit-documentation' }
  },
];

@NgModule({
  declarations: [
    HomeComponent, 
    StandardComponent, AddStandardComponent, EditStandardComponent, 
    RequirementComponent, AddRequirementComponent,
    EditRequirementComponent, DocumentationComponent, AddDocumentationComponent, EditDocumentationComponent, ControlComponent, ControlGroupComponent,
    AddControlGroupComponent, EditControlGroupComponent, EditControlComponent, AddControlComponent, ResponsibleComponent, AddResponsibleComponent,
    EditResponsibleComponent, MaturityLevelComponent, AddMaturityLevelComponent, EditMaturityLevelComponent, IndicatorComponent, AddIndicatorComponent,
    EditIndicatorComponent, EvaluationAdminComponent, AddEvaluationAdminComponent, EditEvaluationAdminComponent, EvaluationProcessListComponent,
    EvaluationProcessComponent, RequirementProcessComponent, ControlProcessComponent, 
    IndicatorsComponent, Indicators2Component, Indicators3Component,Indicators4Component, 
    //DemoComponent, DemoDetalleComponent, DemoDetalleRepairsComponent, 
    RequirementDocumentationComponent, RequirementEvaluationComponent,
    AddRequirementEvaluationComponent, TableRequirementsEvaluationComponent, EditRequirementEvaluationComponent, ControlEvaluationComponent,
    AddControlEvaluationComponent, EditControlEvaluationComponent, DashboardComponent, ControlDashboardComponent, DocumentTypeComponent,
    AddDocumentTypeComponent, EditDocumentTypeComponent, DefaultSectionComponent, AddDefaultSectionComponent, EditDefaultSectionComponent,
    DocumentationManagerComponent, VersionComponent, AddVersionComponent, EditVersionComponent, EditDocumentationManagerComponent,
    SupportForRequirementComponent, AddSupportForRequirementComponent, EditSupportForRequirementComponent, DocumentationSupportComponent,
    EditDocumentationSupportComponent, ConfidentialityLevelComponent, AddConfidentialityLevelComponent, EditConfidentialityLevelComponent,
    SupportForControlComponent, AddSupportForControlComponent, EditSupportForControlComponent, SectionComponent, AddSectionComponent,
    EditSectionComponent, PersonalComponent, AddPersonalComponent, EditPersonalComponent, CreatorComponent, AddCreatorComponent, EditCreatorComponent,
    ReviewerComponent, AddReviewerComponent, EditReviewerComponent, ApproverComponent, AddApproverComponent, EditApproverComponent,
    MacroprocessComponent, AddMacroprocessComponent, EditMacroprocessComponent,
    SubprocessComponent, AddSubprocessComponent, EditSubprocessComponent,
    ActiveTypeComponent, AddActiveTypeComponent, EditActiveTypeComponent,
    OwnerComponent, AddOwnerComponent, EditOwnerComponent,
    CustodianComponent, AddCustodianComponent, EditCustodianComponent,
    UsageClassificationComponent, AddUsageClassificationComponent, EditUsageClassificationComponent,
    SupportTypeComponent, AddSupportTypeComponent, EditSupportTypeComponent,
    LocationComponent, AddLocationComponent, EditLocationComponent,
    ImpactValuationComponent, AddImpactValuationComponent, EditImpactValuationComponent,
    ActivesInventoryComponent, AddActivesInventoryComponent, EditActivesInventoryComponent,
    ValuationInActiveByActivesInventoryComponent, AddValuationInActiveByActivesInventoryComponent, EditValuationInActiveByActivesInventoryComponent,
    OptionComponent, AddOptionComponent, EditOptionComponent,
    MenuComponent, AddMenuComponent, EditMenuComponent, RoleComponent, AddRoleComponent, EditRoleComponent,
    OptionInMenuByMenuComponent, AddOptionInMenuByMenuComponent, EditOptionInMenuByMenuComponent, MenuInRoleComponent,
    UserStateComponent, AddUserStateComponent, EditUserStateComponent,
    UserComponent, AddUserComponent, EditUserComponent, HeaderUserComponent,
    RoleInUserByUserComponent, AddRoleInUserByUserComponent, EditRoleInUserByUserComponent,
    MenaceTypeComponent, AddMenaceTypeComponent, EditMenaceTypeComponent,
    MenaceComponent, AddMenaceComponent, EditMenaceComponent,
    VulnerabilityTypeComponent, AddVulnerabilityTypeComponent, EditVulnerabilityTypeComponent,
    VulnerabilityComponent, AddVulnerabilityComponent, EditVulnerabilityComponent,
    ControlTypeComponent, AddControlTypeComponent, EditControlTypeComponent,
    RiskLevelComponent, AddRiskLevelComponent, EditRiskLevelComponent,
    RiskComponent, AddRiskComponent,
    EditCompanyComponent, CurrentRequirementEvaluationComponent, CurrentControlEvaluationComponent,SectionByDocumentationIdComponent, 
    CurrentPendingDocumentationComponent, PendingDocumentationComponent, LineChartComponent, AnnualSummaryComponent
  ],
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
  exports: [],

})
export class SampleModule { }
