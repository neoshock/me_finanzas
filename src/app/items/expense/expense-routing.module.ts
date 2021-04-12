import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpensePage } from './expense.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensePage
  },
  {
    path: 'add-expense',
    loadChildren: () => import('./add-expense/add-expense.module').then( m => m.AddExpensePageModule)
  },
  {
    path: 'expense-detail',
    loadChildren: () => import('./expense-detail/expense-detail.module').then( m => m.ExpenseDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensePageRoutingModule {}
