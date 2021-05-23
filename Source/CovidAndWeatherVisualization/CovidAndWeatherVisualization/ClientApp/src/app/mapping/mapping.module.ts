import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MappingRoutingModule } from './mapping-routing.module';
import { SearchComponent } from './search/search.component';



@NgModule({
  declarations: [
    MapComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    MappingRoutingModule
  ],
  exports: [
    MapComponent
  ]
})
export class MappingModule { }
