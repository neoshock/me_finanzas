import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomeDetailPageRoutingModule } from './income-detail-routing.module';

import { IncomeDetailPage } from './income-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomeDetailPageRoutingModule
  ],
  declarations: [IncomeDetailPage]
})
export class IncomeDetailPageModule {}
