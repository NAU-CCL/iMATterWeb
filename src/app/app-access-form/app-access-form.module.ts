import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppAccessFormPageRoutingModule } from './app-access-form-routing.module';

import { AppAccessFormPage } from './app-access-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppAccessFormPageRoutingModule
  ],
  declarations: [AppAccessFormPage]
})
export class AppAccessFormPageModule {}
