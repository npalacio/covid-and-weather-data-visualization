import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { WeatherStateService } from '../../state/weather/weather-state.service';
import { chartConfigs } from '../charts-config';

@Component({
  selector: 'app-chart-weather',
  templateUrl: './chart-weather.component.html',
  styleUrls: ['./chart-weather.component.scss']
})
export class ChartWeatherComponent implements OnInit {
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;

  constructor(private datePipe: DatePipe, private weatherStateService: WeatherStateService) { }

  async ngOnInit(): Promise<void> {
    this.chartConfig = chartConfigs.temperature;
    this.weatherStateService.stateChanged.subscribe(state => {
      this.isLoading = state.isLoading;
      if (!this.isLoading) {
        this.chartConfig.data.data = state.temperaturesAverage;
        this.labels = state.dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? 'unknown');
      }
    });
  }

}
