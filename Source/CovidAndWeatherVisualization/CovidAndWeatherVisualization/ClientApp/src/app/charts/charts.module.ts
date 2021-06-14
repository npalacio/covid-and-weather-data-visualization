import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel/panel.component';



@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PanelComponent
  ]
})
export class ChartsModule { }
