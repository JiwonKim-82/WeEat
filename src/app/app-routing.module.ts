import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { PostingComponent } from './search/posting/posting.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  {
    path: 'dashboard/:uid',
    component: DashboardComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuard], 
    children: [
      {
        path: 'posting',
        component: PostingComponent,
        canActivate: [AuthGuard], 
      },
    ],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }, // Redirect all unmatched routes to the login page
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
