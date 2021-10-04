import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveysPageRoutingModule } from './surveys-routing.module';

import { SurveysPage } from './surveys.page';
import { RouterModule } from '@angular/router';
import { NgCalendarModule } from 'ionic2-calendar';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveysPageRoutingModule,
    NgCalendarModule,
  ],
  declarations: [SurveysPage],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ]
})
export class SurveysPageModule { }
