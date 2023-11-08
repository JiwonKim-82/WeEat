import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {AuthActions} from './action-types';
import { catchError, concatMap, map, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";
import { FirebaseService } from "src/app/service/firebase.service";

@Injectable()
export class AuthEffects {

    login$ = createEffect(() =>
        this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap((action) =>
            this.authService.logIn(action.email, action.password).pipe(
            tap((user) => localStorage.setItem('user', JSON.stringify(user))),
            map((user) => AuthActions.loginSuccess({ user })),
            catchError(() => of(AuthActions.loginFailure()))
            )
        )
        ),
        {dispatch: true}
    );


    logout$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.logout),
                tap(action => {
                    localStorage.removeItem('user');
                    this.router.navigateByUrl('/login');
                })
            )
    , {dispatch: false});


    signUp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signup),
            switchMap((action) => {
            return this.authService.signUp(action.email, action.password, action.displayName).pipe(
                concatMap((user) => {
                if (action.file) {
                    return this.fire.uploadProfileImage(user, action.file).pipe(
                    tap((updatedUser) => {
                        this.fire.uploadUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(user));
                    }),
                    map((updatedUser) => {
                        this.router.navigate(['/WeEat/search']);
                        return AuthActions.signupSuccess({ user: updatedUser });
                    }),
                    catchError((error) => of(AuthActions.signupFailure()))
                    );
                } else {
                    const userWithoutImage = { ...user, profileURL: 'assets/images/default-profile-image.webp' };
                    return this.fire.uploadUser(userWithoutImage).pipe(
                    map((updatedUser) => {
                        this.router.navigate(['/WeEat/search']);
                        return AuthActions.signupSuccess({ user: updatedUser });
                    }),
                    catchError((error) => of(AuthActions.signupFailure()))
                    );
                }
                }),
                catchError((error) => of(AuthActions.signupFailure()))
            );
            })
        ),
        { dispatch: true }
    );

    

    constructor(private actions$: Actions,
                private router: Router,
                private authService: AuthService,
                private fire: FirebaseService) {

    }

}