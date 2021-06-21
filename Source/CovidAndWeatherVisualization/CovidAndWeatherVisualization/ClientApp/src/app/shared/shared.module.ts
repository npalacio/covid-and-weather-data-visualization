import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    Ng2ChartsModule
  ],
  exports: [
    ChartComponent
  ]
})
export class SharedModule { }
