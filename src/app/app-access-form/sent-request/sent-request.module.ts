import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SentRequestPageRoutingModule } from './sent-request-routing.module';

import { SentRequestPage } from './sent-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SentRequestPageRoutingModule
  ],
  declarations: [SentRequestPage]
})
export class SentRequestPageModule {}
