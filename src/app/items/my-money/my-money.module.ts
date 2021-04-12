import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMoneyPageRoutingModule } from './my-money-routing.module';

import { MyMoneyPage } from './my-money.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMoneyPageRoutingModule
  ],
  declarations: [MyMoneyPage]
})
export class MyMoneyPageModule {}
