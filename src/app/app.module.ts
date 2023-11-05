import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';

import { environment } from 'src/environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { SideNavBarComponent } from './side-navbar/side-navbar.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthModule } from './auth/auth/auth.module';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';


@NgModule({
    declarations: [AppComponent],
    imports: [
    CommonModule,
    BrowserModule,
    AuthModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    HeaderComponent,
    SideNavBarComponent,
    ConfirmDialogComponent,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
],
    providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
