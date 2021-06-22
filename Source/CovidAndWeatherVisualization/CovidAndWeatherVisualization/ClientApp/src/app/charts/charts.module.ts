import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { RouterModule } from '@angular/router';
import { PanelHeaderComponent } from './panel-header/panel-header.component';
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts/charts.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartCovidComponent } from './chart-covid/chart-covid.component';
import { SharedModule } from '../shared/shared.module';
import { ChartWeatherComponent } from './chart-weather/chart-weather.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartSettingsComponent } from './chart-settings/chart-settings.component';

@NgModule({
  declarations: [
    PanelComponent,
    PanelHeaderComponent,
    ChartsComponent,
    ChartCovidComponent,
    ChartWeatherComponent,
    ChartSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModalModule,
    SharedModule
  ],
  exports: [
    PanelComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ChartsModule { }
