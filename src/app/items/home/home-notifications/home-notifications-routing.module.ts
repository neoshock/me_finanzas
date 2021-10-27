import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeNotificationsPage } from './home-notifications.page';

const routes: Routes = [
  {
    path: '',
    component: HomeNotificationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeNotificationsPageRoutingModule {}
