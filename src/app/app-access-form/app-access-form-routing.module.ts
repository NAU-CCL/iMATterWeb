import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppAccessFormPage } from './app-access-form.page';

const routes: Routes = [
  {
    path: '',
    component: AppAccessFormPage
  },
  {
    path: 'sent-request',
    loadChildren: () => import('./sent-request/sent-request.module').then( m => m.SentRequestPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppAccessFormPageRoutingModule {}
