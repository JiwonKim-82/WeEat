import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import { User } from '../model/user.model';
import { AuthActions } from './action-types';

export interface AuthState {
  user: User
}

export const initialAuthState: AuthState = {
  user: undefined
}

export const authReducer = createReducer(

  initialAuthState,

  on(AuthActions.login, (state, action) => ({
    ...state,
    user: undefined
  })),

  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    user: action.user
  })),

  on(AuthActions.loginFailure, (state, action) => ({
    ...state,
    user: undefined
  })),
  
  on(AuthActions.logout, (state, action) => ({
    ...state,
    user: undefined
  })),

  on(AuthActions.signup, (state, action) => ({
    ...state,
    user: undefined
  })),

  on(AuthActions.signupSuccess, (state, action) => ({
    ...state,
    user: action.user
  }))

);
