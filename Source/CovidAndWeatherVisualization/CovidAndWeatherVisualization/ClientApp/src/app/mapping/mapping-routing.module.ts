import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: 'counties', redirectTo: 'counties/', pathMatch: 'full' },
  { path: 'counties/:fips', component: MapComponent },
  { path: '**', redirectTo: 'counties/' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingRoutingModule {
}
