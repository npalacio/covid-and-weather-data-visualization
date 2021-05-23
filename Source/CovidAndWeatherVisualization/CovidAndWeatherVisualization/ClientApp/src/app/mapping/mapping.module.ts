import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MappingRoutingModule } from './mapping-routing.module';
import { SearchComponent } from './search/search.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MapComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    MappingRoutingModule,
    NgbTypeaheadModule,
    FormsModule
  ],
  exports: [
    MapComponent
  ]
})
export class MappingModule { }
