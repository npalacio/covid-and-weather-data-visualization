import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppContainerComponent } from './app-container/app-container.component';

const routes: Routes = [
  { path: 'counties', redirectTo: 'counties/', pathMatch: 'full' },
  { path: 'counties/:fips', component: AppContainerComponent },
  { path: '**', redirectTo: 'counties/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
