import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FingerPrintPageRoutingModule } from './finger-print-routing.module';

import { FingerPrintPage } from './finger-print.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FingerPrintPageRoutingModule
  ],
  declarations: [FingerPrintPage]
})
export class FingerPrintPageModule {}
