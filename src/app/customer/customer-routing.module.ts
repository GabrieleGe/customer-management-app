import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomersListComponent } from './customers-list/customers-list.component';

const routes: Routes = [

    { path: 'list', component: CustomersListComponent },
    { path: 'create', component: CustomerFormComponent },
    { path: 'edit/:id', component: CustomerFormComponent },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }
