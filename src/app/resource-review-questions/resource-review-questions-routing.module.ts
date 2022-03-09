import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceReviewQuestionsPage } from './resource-review-questions.page';

const routes: Routes = [
  {
    path: '',
    component: ResourceReviewQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceReviewQuestionsPageRoutingModule {}
