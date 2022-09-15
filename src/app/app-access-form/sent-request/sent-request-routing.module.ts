import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SentRequestPage } from './sent-request.page';

const routes: Routes = [
  {
    path: '',
    component: SentRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SentRequestPageRoutingModule {}
