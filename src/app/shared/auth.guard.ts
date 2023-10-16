import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService._isLoggedIn.pipe(
      map((isAuth) => {
        if (isAuth) {
          return true; // User is authenticated, allow access
        } else {
          // User is not authenticated, navigate to login page
          const loginUrl = this.router.createUrlTree(['/login']);
          alert('You must log in first!'); // Display an alert message
          return loginUrl;
        }
      })
    );
  }

}