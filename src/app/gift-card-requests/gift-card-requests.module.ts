import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftCardRequestsPageRoutingModule } from './gift-card-requests-routing.module';

import { GiftCardRequestsPage } from './gift-card-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftCardRequestsPageRoutingModule
  ],
  declarations: [GiftCardRequestsPage]
})
export class GiftCardRequestsPageModule {}
