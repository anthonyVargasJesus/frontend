import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { ActivesRoutingModule } from './actives-routing.module';
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


@NgModule({
  declarations: [MacroprocessComponent, AddMacroprocessComponent, EditMacroprocessComponent,
    SubprocessComponent, AddSubprocessComponent, EditSubprocessComponent,
    ActiveTypeComponent, AddActiveTypeComponent, EditActiveTypeComponent,
    OwnerComponent, AddOwnerComponent, EditOwnerComponent,
    CustodianComponent, AddCustodianComponent, EditCustodianComponent,
    UsageClassificationComponent, AddUsageClassificationComponent, EditUsageClassificationComponent,
    SupportTypeComponent, AddSupportTypeComponent, EditSupportTypeComponent,
    LocationComponent, AddLocationComponent, EditLocationComponent,
    ImpactValuationComponent, AddImpactValuationComponent, EditImpactValuationComponent,
    ActivesInventoryComponent, AddActivesInventoryComponent, EditActivesInventoryComponent,
    ValuationInActiveByActivesInventoryComponent, AddValuationInActiveByActivesInventoryComponent,
    EditValuationInActiveByActivesInventoryComponent,
  ],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    ActivesRoutingModule,
    ContentHeaderModule,
    TranslateModule,
    CoreCommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    NgbModule,
  ]
})


export class ActivesModule { }
