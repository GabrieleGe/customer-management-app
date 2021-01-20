import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'customer',
  loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
},
{
  path: '',
  redirectTo: 'customer',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
