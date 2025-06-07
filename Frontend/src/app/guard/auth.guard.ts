import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage.getItem("token")) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    }

    // En SSR no permitimos navegación protegida
    return false;
  }
}
