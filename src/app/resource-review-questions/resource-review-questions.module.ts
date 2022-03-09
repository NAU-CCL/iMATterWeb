import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourceReviewQuestionsPageRoutingModule } from './resource-review-questions-routing.module';

import { ResourceReviewQuestionsPage } from './resource-review-questions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ResourceReviewQuestionsPageRoutingModule
  ],
  declarations: [ResourceReviewQuestionsPage]
})
export class ResourceReviewQuestionsPageModule {}
