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
import { StandardComponent } from './standard/standard.component';
import { AddStandardComponent } from './standard/add-standard/add-standard.component';
import { EditStandardComponent } from './standard/edit-standard/edit-standard.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { AddDocumentationComponent } from './documentation/add-documentation/add-documentation.component';
import { EditDocumentationComponent } from './documentation/edit-documentation/edit-documentation.component';
import { ResponsibleComponent } from './responsible/responsible.component';
import { AddResponsibleComponent } from './responsible/add-responsible/add-responsible.component';
import { EditResponsibleComponent } from './responsible/edit-responsible/edit-responsible.component';
import { RequirementComponent } from './requirement/requirement.component';
import { AddRequirementComponent } from './requirement/add-requirement/add-requirement.component';
import { EditRequirementComponent } from './requirement/edit-requirement/edit-requirement.component';
import { ControlComponent } from './control/control.component';
import { ControlGroupComponent } from './control-group/control-group.component';
import { AddControlGroupComponent } from './control-group/add-control-group/add-control-group.component';
import { EditControlGroupComponent } from './control-group/edit-control-group/edit-control-group.component';
import { EditControlComponent } from './control/edit-control/edit-control.component';
import { AddControlComponent } from './control/add-control/add-control.component';
import { CurrentStandardRoutingModule } from './current-standard-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { PolicyByStandardComponent } from './policy-by-standard/policy-by-standard.component';
import { AddPolicyByStandardComponent } from './policy-by-standard/add-policy-by-standard/add-policy-by-standard.component';
import { EditPolicyComponent } from './policy-by-standard/edit-policy/edit-policy.component';
import { ScopeByStandardComponent } from './scope-by-standard/scope-by-standard.component';
import { AddScopeByStandardComponent } from './scope-by-standard/add-scope-by-standard/add-scope-by-standard.component';
import { EditScopeByStandardComponent } from './scope-by-standard/edit-scope-by-standard/edit-scope-by-standard.component';
import { HomeStandardComponent } from './home-standard/home-standard.component';
import { DefaultSectionComponent } from './default-section/default-section.component';
import { AddDefaultSectionComponent } from './default-section/add-default-section/add-default-section.component';
import { EditDefaultSectionComponent } from './default-section/edit-default-section/edit-default-section.component';
import { SectionComponent } from './section/section.component';
import { AddSectionComponent } from './section/add-section/add-section.component';
import { EditSectionComponent } from './section/edit-section/edit-section.component';
import { SectionByDocumentationIdComponent } from './section/section-by-documentation-id/section-by-documentation-id.component';
import { DefaultRiskComponent } from './default-risk/default-risk.component';
import { AddDefaultRiskComponent } from './default-risk/add-default-risk/add-default-risk.component';
import { EditDefaultRiskComponent } from './default-risk/edit-default-risk/edit-default-risk.component';
import { RequirementInDefaultRiskByRequirementComponent } from './requirement-in-default-risk-by-requirement/requirement-in-default-risk-by-requirement.component';
import { AddRequirementInDefaultRiskByRequirementComponent } from './requirement-in-default-risk-by-requirement/add-requirement-in-default-risk-by-requirement/add-requirement-in-default-risk-by-requirement.component';
import { EditRequirementInDefaultRiskByRequirementComponent } from './requirement-in-default-risk-by-requirement/edit-requirement-in-default-risk-by-requirement/edit-requirement-in-default-risk-by-requirement.component';
import { ControlInDefaultRiskByControlComponent } from './control-in-default-risk-by-control/control-in-default-risk-by-control.component';
import { AddControlInDefaultRiskByControlComponent } from './control-in-default-risk-by-control/add-control-in-default-risk-by-control/add-control-in-default-risk-by-control.component';
import { EditControlInDefaultRiskByControlComponent } from './control-in-default-risk-by-control/edit-control-in-default-risk-by-control/edit-control-in-default-risk-by-control.component';
import { AddActivesInventoryInDefaultRiskByDefaultRiskComponent } from './actives-inventory-in-default-risk-by-default-risk/add-actives-inventory-in-default-risk-by-default-risk/add-actives-inventory-in-default-risk-by-default-risk.component';
import { ActivesInventoryInDefaultRiskByDefaultRiskComponent } from './actives-inventory-in-default-risk-by-default-risk/actives-inventory-in-default-risk-by-default-risk.component';
import { EditActivesInventoryInDefaultRiskByDefaultRiskComponent } from './actives-inventory-in-default-risk-by-default-risk/edit-actives-inventory-in-default-risk-by-default-risk/edit-actives-inventory-in-default-risk-by-default-risk.component';


@NgModule({
  declarations: [StandardComponent, AddStandardComponent, EditStandardComponent, DocumentationComponent, 
    AddDocumentationComponent, EditDocumentationComponent, ResponsibleComponent, AddResponsibleComponent,
      EditResponsibleComponent,DefaultSectionComponent, AddDefaultSectionComponent, EditDefaultSectionComponent,
        RequirementComponent, AddRequirementComponent,
        EditRequirementComponent, ControlComponent, ControlGroupComponent,
        AddControlGroupComponent, EditControlGroupComponent, EditControlComponent, AddControlComponent,
        PolicyByStandardComponent, AddPolicyByStandardComponent, EditPolicyComponent,
        ScopeByStandardComponent, AddScopeByStandardComponent, EditScopeByStandardComponent, HomeStandardComponent,
        SectionComponent, AddSectionComponent,EditSectionComponent, SectionByDocumentationIdComponent, DefaultRiskComponent, AddDefaultRiskComponent, EditDefaultRiskComponent,
        RequirementInDefaultRiskByRequirementComponent, AddRequirementInDefaultRiskByRequirementComponent, EditRequirementInDefaultRiskByRequirementComponent ,
        ControlInDefaultRiskByControlComponent, AddControlInDefaultRiskByControlComponent, EditControlInDefaultRiskByControlComponent,
        ActivesInventoryInDefaultRiskByDefaultRiskComponent, AddActivesInventoryInDefaultRiskByDefaultRiskComponent, EditActivesInventoryInDefaultRiskByDefaultRiskComponent
      ],
  imports: [
        CommonModule,
        NgxMaskModule.forRoot(),
        CurrentStandardRoutingModule,
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        MatExpansionModule,
        NgbModule,
  ]
})


export class CurrentStandardModule { }
