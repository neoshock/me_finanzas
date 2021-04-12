import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartedPage } from './started.page';

const routes: Routes = [
  {
    path: '',
    component: StartedPage
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'user-update',
    loadChildren: () => import('./user-update/user-update.module').then( m => m.UserUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartedPageRoutingModule {}
