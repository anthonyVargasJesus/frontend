import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MacroprocessComponent } from './macroprocess/macroprocess.component';
import { SubprocessComponent } from './subprocess/subprocess.component';
import { ActiveTypeComponent } from './active-type/active-type.component';
import { OwnerComponent } from './owner/owner.component';
import { CustodianComponent } from './custodian/custodian.component';
import { UsageClassificationComponent } from './usage-classification/usage-classification.component';
import { SupportTypeComponent } from './support-type/support-type.component';
import { LocationComponent } from './location/location.component';
import { ImpactValuationComponent } from './impact-valuation/impact-valuation.component';
import { ActivesInventoryComponent } from './actives-inventory/actives-inventory.component';
import { AddActivesInventoryComponent } from './actives-inventory/add-actives-inventory/add-actives-inventory.component';
import { EditActivesInventoryComponent } from './actives-inventory/edit-actives-inventory/edit-actives-inventory.component';

const routes: Routes = [
    {
        path: 'macroprocess',
        component: MacroprocessComponent,
    },
    {
        path: 'subprocess',
        component: SubprocessComponent,
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ActivesRoutingModule { }