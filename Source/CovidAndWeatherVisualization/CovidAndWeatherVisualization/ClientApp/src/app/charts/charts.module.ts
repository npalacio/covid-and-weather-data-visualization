import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { RouterModule } from '@angular/router';
import { PanelHeaderComponent } from './panel-header/panel-header.component';



@NgModule({
  declarations: [
    PanelComponent,
    PanelHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PanelComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ChartsModule { }
