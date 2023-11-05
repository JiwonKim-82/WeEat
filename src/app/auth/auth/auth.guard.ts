// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { AuthService } from '../../service/auth.service';
// import { Observable, map } from 'rxjs';
// import { SnackbarService } from '../../service/snackbar.service';

// @Injectable()

// export class AuthGuard implements CanActivate {
//   constructor(
//     private authService: AuthService, 
//     private snackbarService: SnackbarService,
//     private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> {
//     return this.authService._isLoggedIn.pipe(
//       map((isAuth) => {
//         if (isAuth) {
//           return true; // User is authenticated, allow access
//         } else {
//           // User is not authenticated, navigate to login page
//           const loginUrl = this.router.createUrlTree(['/login']);
//           this.snackbarService.show('You must log in first!', 'warning')
//           return loginUrl;
//         }
//       })
//     );
//   }

// }

// Below is the code for the auth.guard.ts file with the NGRX implementation:

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/internal/operators/tap";
import { AuthState } from "./reducers";
import { SnackbarService } from "src/app/service/snackbar.service";
import { isLoggedIn } from "./auth.selectors";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private store: Store<AuthState>,
        private router: Router) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.store
            .pipe(
                select(isLoggedIn),
                tap(loggedIn => {
                    if (!loggedIn) {
                        this.router.navigateByUrl('/login');
                    }
                })
            )


    }

}