import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MappingRoutingModule } from './mapping-routing.module';



@NgModule({
  declarations: [
    MapComponent
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
