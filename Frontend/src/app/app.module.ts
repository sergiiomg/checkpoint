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
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SignUpComponent,
    AppComponent,
    LoginPageComponent,
    PerfilPageComponent,
    EditarPerfilComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule, 
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
