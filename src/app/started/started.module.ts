import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartedPageRoutingModule } from './started-routing.module';

import { StartedPage } from './started.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartedPageRoutingModule
  ],
  declarations: [StartedPage]
})
export class StartedPageModule {}
