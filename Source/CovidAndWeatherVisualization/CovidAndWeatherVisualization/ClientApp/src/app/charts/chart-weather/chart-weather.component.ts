import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { WeatherStateService } from '../../state/weather/weather-state.service';
import { chartConfigs } from '../charts-config';
import { ChartSettingsStateService } from '../../state/chart/chart-settings-state.service';
import { WeatherChart } from 'src/app/shared/models';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-chart-weather',
  templateUrl: './chart-weather.component.html',
  styleUrls: ['./chart-weather.component.scss']
})
export class ChartWeatherComponent implements OnInit {
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;

  constructor(private datePipe: DatePipe
    , private weatherStateService: WeatherStateService
    , private chartSettingsStateService: ChartSettingsStateService) { }

  async ngOnInit(): Promise<void> {
    this.chartConfig = { ...chartConfigs.temperature };
    combineLatest([this.chartSettingsStateService.stateChanged, this.weatherStateService.stateChanged]).subscribe(([chartSettingsState, weatherState]) => {
      this.isLoading = weatherState.isLoading;
      this.labels = weatherState.selectedWeatherData.map(data => this.datePipe.transform(data.date, 'MM/dd') ?? 'unknown');
      this.chartConfig.data.data = weatherState.selectedWeatherData.map(data => data.value);
      if (!this.isLoading && chartSettingsState.weatherChart) {
        switch (chartSettingsState.weatherChart) {
          case WeatherChart.Temperature:
            this.chartConfig = { ...chartConfigs.temperature };
            break;
          case WeatherChart.HumidityRelative:
            this.chartConfig = { ...chartConfigs.humidityRelative };
            break;
          case WeatherChart.HumiditySpecific:
            this.chartConfig = { ...chartConfigs.humiditySpecific };
            break;
        }
      }
    });
  }
}
