import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth/auth/auth.guard';

export const AppRoutes: Routes = [
  { path: 'signup', component: SignUpComponent },
  {
    path: 'WeEat',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./feature/feature.module').then((m) => m.FeatureModule),
  },
  {
    path: '**',
    redirectTo: '/'
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(AppRoutes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
// export const AppRoutes: Routes = [
//   { path: 'signup', component: SignUpComponent },
//   {
//     path: 'dashboard/:uid',
//     component: DashboardComponent,
//     canActivate: [AuthGuard], 
//   },
//   {
//     path: 'search',
//     component: SearchComponent,
//     canActivate: [AuthGuard], 
//     children: [
//       {
//         path: 'posting',
//         component: PostingComponent,
//         canActivate: [AuthGuard], 
//       },
//     ],
//   },
//   {
//     path: '**',
//     redirectTo: '/'
//   }
// ];