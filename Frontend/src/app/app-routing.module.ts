import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignUpComponent } from './components/signup-page/signup-page.component';
import { PerfilPageComponent } from './components/perfil-page/perfil-page.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'usuarios', component: SignUpComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'perfil', component: PerfilPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
