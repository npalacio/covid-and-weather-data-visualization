import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { RouterModule } from '@angular/router';
import { PanelHeaderComponent } from './panel-header/panel-header.component';
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts/charts.component';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartCovidComponent } from './chart-covid/chart-covid.component';

@NgModule({
  declarations: [
    PanelComponent,
    PanelHeaderComponent,
    ChartsComponent,
    ChartCovidComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsRoutingModule,
    Ng2ChartsModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  exports: [
    PanelComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ChartsModule { }
