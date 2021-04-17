import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMoneyPage } from './my-money.page';

const routes: Routes = [
  {
    path: '',
    component: MyMoneyPage
  },
  {
    path: 'add-account',
    loadChildren: () => import('./add-account/add-account.module').then( m => m.AddAccountPageModule)
  },
  {
    path: 'edit-account',
    loadChildren: () => import('./edit-account/edit-account.module').then( m => m.EditAccountPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMoneyPageRoutingModule {}
