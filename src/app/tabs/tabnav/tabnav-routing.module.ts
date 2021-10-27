import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabnavPage } from './tabnav.page';

const routes: Routes = [
  {
    path: '',
    component: TabnavPage,
    children:[
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: ()=> import('../../items/home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'movements',
        children: [{
          path: '',
          loadChildren: () => import('../../items/movements/movements.module').then( m => m.MovementsPageModule)
        }]
      },
      {
        path: 'my-money',
        children: [
          {
            path: "",
            loadChildren: () => import('../../items/my-money/my-money.module').then( m => m.MyMoneyPageModule)
            },{
              path: "add-account/:desc",
              loadChildren: () => import('../../items/my-money/add-account/add-account.module').then(m => m.AddAccountPageModule)
            },{
              path: "edit-account/:id-account",
              loadChildren: () => import('../../items/my-money/edit-account/edit-account.module').then(m => m.EditAccountPageModule)
            }
        ]
      },
      {
        path: 'config',
        children: [
          {
            path: '',
            loadChildren: () => import('../../options/config/config.module').then( m => m.ConfigPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabnav/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabnavPageRoutingModule {}
