import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Err404Component } from './pages/err404/err404.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {path:"users", component:UsersComponent},
  {path:"**", component:Err404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
