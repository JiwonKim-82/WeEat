
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/internal/operators/tap";
import { AuthState } from "./store";
import { SnackbarService } from "src/app/service/snackbar.service";
import { isLoggedIn } from "./store/auth.selectors";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private store: Store<AuthState>,
        private router: Router,
        private snackbarService: SnackbarService) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.store
            .pipe(
                select(isLoggedIn),
                tap(loggedIn => {
                    if (!loggedIn) {
                        this.snackbarService.show('Please log in first', 'error');
                        this.router.navigateByUrl('/login');
                    }
                })
            )


    }

}