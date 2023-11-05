import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const featureRoutes: Routes = [
    {
      path: 'search',
      loadChildren: () =>
        import('./search/search.module').then((m) => m.SearchModule),
    },
    {
      path: 'dashboard/:id',
      loadChildren: () =>
        import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
  ];
  

@NgModule({
  imports: [RouterModule.forChild(featureRoutes)],
  exports: [RouterModule],
})
export class FeatureModule {}