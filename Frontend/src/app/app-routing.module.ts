import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignUpComponent } from './components/signup-page/signup-page.component';
import { PerfilPageComponent } from './components/perfil-page/perfil-page.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'usuarios', component: SignUpComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'perfil', component: PerfilPageComponent, canActivate: [AuthGuard]  },
  { path: 'editar-perfil', component: EditarPerfilComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
