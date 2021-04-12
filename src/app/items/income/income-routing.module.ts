import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomePage } from './income.page';

const routes: Routes = [
  {
    path: '',
    component: IncomePage
  },
  {
    path: 'add-income',
    loadChildren: () => import('./add-income/add-income.module').then( m => m.AddIncomePageModule)
  },
  {
    path: 'income-detail',
    loadChildren: () => import('./income-detail/income-detail.module').then( m => m.IncomeDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomePageRoutingModule {}
