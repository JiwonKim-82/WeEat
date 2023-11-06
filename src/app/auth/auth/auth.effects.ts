import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {AuthActions} from './action-types';
import { catchError, exhaustMap, filter, map, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";

@Injectable()
export class AuthEffects {

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            exhaustMap((action) =>
            this.authService.logIn(action.email, action.password).pipe(
                tap((user) => {
                    localStorage.setItem('user', JSON.stringify(user))
                    this.router.navigate(['/WeEat/dashboard', user.uid]);
                }),
                map((user) => AuthActions.loginSuccess({ user })),
                catchError((error) => {
                console.error('Login failed:', error.message);
                return of(AuthActions.loginFailure());
                })
            )
            )
        ),
        { dispatch: true }
    );


    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap((action) => {
                localStorage.clear()
                this.router.navigate(['/login'])
            })
        ),
        { dispatch: false }
);
    


    constructor(private actions$: Actions,
                private router: Router,
                private authService: AuthService) {

    }

}