import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FingerPrintPage } from './finger-print.page';

const routes: Routes = [
  {
    path: '',
    component: FingerPrintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FingerPrintPageRoutingModule {}
