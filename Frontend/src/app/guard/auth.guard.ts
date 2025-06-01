import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor (public router: Router) { }

  /**
   
Auth guard. Redirects to the login page if the user is not signed
 
@param route path where to navigate,
@param state actual state of the navigation snapshot*/
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!localStorage.getItem("token")) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
  }

}
