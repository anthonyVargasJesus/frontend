import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomRequirementEvaluationComponent } from './custom-requirement-evaluation/custom-requirement-evaluation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomRequirementComponent } from './custom-requirement/custom-requirement.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CustomRequirementEvaluationComponent, CustomRequirementComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
  ],
  exports: [
    CustomRequirementEvaluationComponent,
    CustomRequirementComponent
  ],
})

export class CustomComponentsModule { }
