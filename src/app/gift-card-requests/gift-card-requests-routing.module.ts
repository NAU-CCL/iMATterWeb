import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftCardRequestsPage } from './gift-card-requests.page';

const routes: Routes = [
  {
    path: '',
    component: GiftCardRequestsPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftCardRequestsPageRoutingModule {}
