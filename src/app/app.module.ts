import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';

import { environment } from 'src/environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { SideNavBarComponent } from './side-navbar/side-navbar';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
    declarations: [AppComponent],
    imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    HeaderComponent,
    SideNavBarComponent,
    ConfirmDialogComponent
],
    providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
