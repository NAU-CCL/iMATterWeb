import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MobileSettingsPageRoutingModule } from './mobile-settings-routing.module';

import { MobileSettingsPage } from './mobile-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MobileSettingsPageRoutingModule
  ],
  declarations: [MobileSettingsPage]
})
export class MobileSettingsPageModule {}
