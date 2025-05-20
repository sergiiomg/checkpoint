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
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppAsideComponent } from './components/app-aside/app-aside.component';

@NgModule({
  declarations: [
    SignUpComponent,
    AppComponent,
    LoginPageComponent,
    PerfilPageComponent,
    AppHeaderComponent,
    AppAsideComponent
  ],
  imports: [
    BrowserModule,
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
