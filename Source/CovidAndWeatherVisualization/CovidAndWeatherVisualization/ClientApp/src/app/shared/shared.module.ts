import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    Ng2ChartsModule
  ],
  exports: [
    ChartComponent
  ]
})
export class SharedModule { }
