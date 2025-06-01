import { ApplicationConfig, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SignUpComponent } from './components/signup-page/signup-page.component';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { PerfilPageComponent } from './components/perfil-page/perfil-page.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppAsideComponent } from './components/app-aside/app-aside.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PublicacionesGuardadasComponent } from './components/publicaciones-guardadas/publicaciones-guardadas.component';

@NgModule({
  declarations: [
    SignUpComponent,
    AppComponent,
    LoginPageComponent,
    PerfilPageComponent,
    EditarPerfilComponent
    AppHeaderComponent,
    AppAsideComponent,
    DashboardPageComponent,
    CrearPublicacionComponent,
    PublicacionesGuardadasComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
     provideHttpClient(withInterceptorsFromDi()),
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
