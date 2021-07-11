import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { WeatherStateService } from '../../state/weather/weather-state.service';
import { chartConfigs } from '../charts-config';
import { ChartSettingsStateService } from '../../state/chart/chart-settings-state.service';
import { WeatherChartEnum } from 'src/app/shared/models';
import { combineLatest } from 'rxjs';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';

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
      if (!this.isLoading && chartSettingsState.weatherChart) {
        switch (chartSettingsState.weatherChart) {
          case WeatherChartEnum.Temperature:
            this.chartConfig = { ...chartConfigs.temperature };
            break;
          case WeatherChartEnum.HumidityRelative:
            this.chartConfig = { ...chartConfigs.humidityRelative };
            break;
          case WeatherChartEnum.HumiditySpecific:
            this.chartConfig = { ...chartConfigs.humiditySpecific };
            break;
        }
        this.labels = weatherState.selectedWeatherData.map(data => this.datePipe.transform(data.date, 'MM/dd') ?? 'unknown');
        this.chartConfig.data.data = weatherState.selectedWeatherData.map(data => data.value);
      }
    });
  }
}
