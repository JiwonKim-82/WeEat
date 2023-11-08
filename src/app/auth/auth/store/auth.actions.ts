import { createAction, props } from "@ngrx/store";
import { User } from "../model/user.model";
import { FileUpload } from "src/app/model/file-upload.model";

export const login = createAction(
    '[Login Page] Login',
    props<{ email: string, password: string }>()
  );
  
  export const loginSuccess = createAction(
    '[Login Page] Login Success',
    props<{ user: User }>()
  );
  
  export const loginFailure = createAction(
    '[Login Page] Login Failure'
  );
  
  export const logout = createAction('[Navigation Bar] Logout');

  export const signup = createAction(
    '[Signup Page] Signup', 
    props<{ email: string, password: string, displayName: string, file:FileUpload }>()
  );

  export const signupSuccess = createAction(
    '[Signup Page] Signup Success',
    props<{ user: any }>()
  );

  export const signupFailure = createAction(
    '[Signup Page] Signup Failure'
  );

  