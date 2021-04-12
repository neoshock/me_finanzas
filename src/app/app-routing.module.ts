import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'started',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./items/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'my-money',
    children: [
      {
      path: "",
      loadChildren: () => import('./items/my-money/my-money.module').then( m => m.MyMoneyPageModule)
      },{
        path: "add-account/:desc",
        loadChildren: () => import('./items/my-money/add-account/add-account.module').then(m => m.AddAccountPageModule)
      }
    ]
  },
  {
    path: 'income',
    children: [
      {
        path: "",
        loadChildren: () => import('./items/income/income.module').then( m => m.IncomePageModule)
      },{
        path: "detail/:id-income",
        loadChildren: () => import('./items/income/income-detail/income-detail.module').then( m => m.IncomeDetailPageModule)
      }
    ]
  },
  {
    path: 'expense',
    children: [
      {path: "",
      loadChildren: () => import('./items/expense/expense.module').then( m => m.ExpensePageModule)
      },{
        path: "detail/:id-expense",
        loadChildren: () => import('./items/expense/expense-detail/expense-detail.module').then( m => m.ExpenseDetailPageModule)
      }
    ]
  },
  {
    path: 'started',
    children: [
      {
        path: "",
        loadChildren: () => import('./started/started.module').then( m => m.StartedPageModule)
      },
      {
        path:"login",
        loadChildren: () => import('./started/login/login.module').then( m => m.LoginPageModule)
      },{
        path: "register",
        loadChildren: () => import('./started/register/register.module').then( m => m.RegisterPageModule)
      },{
        path: 'user-update',
        loadChildren: () => import('./started/user-update/user-update.module').then(m => m.UserUpdatePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
