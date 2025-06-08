import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignUpComponent } from './components/signup-page/signup-page.component';
import { PerfilPageComponent } from './components/perfil-page/perfil-page.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { AuthGuard } from './guard/auth.guard';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { PublicacionDetalleComponent } from './components/publicacion-detalle/publicacion-detalle.component';
import { PerfilUserComponent } from './components/perfil-user/perfil-user.component';
import { AmigosComponent } from './components/amigos/amigos.component';
import { LogrosComponent } from './components/logros/logros.component';
import { PublicacionesGuardadasComponent } from './components/publicaciones-guardadas/publicaciones-guardadas.component';
import { MotesComponent } from './components/motes/motes.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { NivelComponent } from './components/nivel/nivel.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'usuarios', component: SignUpComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'perfil', component: PerfilPageComponent, canActivate: [AuthGuard]  },
  { path: 'amigos', component: AmigosComponent},
  { path: 'logros', component: LogrosComponent },
  { path: 'usuarios/:id',component: PerfilUserComponent},
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'crear-publicacion', component: CrearPublicacionComponent },
  { path: 'publicacion/:id', component: PublicacionDetalleComponent},
  { path: 'publicaciones-guardadas', component: PublicacionesGuardadasComponent},
  { path: 'motes', component: MotesComponent},
  { path: 'buscar', component: BuscadorComponent },
  { path: 'nivel', component: NivelComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
