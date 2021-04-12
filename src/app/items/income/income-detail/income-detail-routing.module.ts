import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomeDetailPage } from './income-detail.page';

const routes: Routes = [
  {
    path: '',
    component: IncomeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeDetailPageRoutingModule {}
