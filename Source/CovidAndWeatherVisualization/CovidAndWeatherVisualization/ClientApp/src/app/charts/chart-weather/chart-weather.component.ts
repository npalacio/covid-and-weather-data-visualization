import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { WeatherStateService } from '../../state/weather/weather-state.service';
import { chartConfigs } from '../charts-config';
import { ChartSettingsStateService } from '../../state/chart/chart-settings-state.service';
import { WeatherChart } from 'src/app/shared/models';

@Component({
  selector: 'app-chart-weather',
  templateUrl: './chart-weather.component.html',
  styleUrls: ['./chart-weather.component.scss']
})
export class ChartWeatherComponent implements OnInit {
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;
  weatherChart?: WeatherChart;

  constructor(private datePipe: DatePipe
            , private weatherStateService: WeatherStateService
            , private chartSettingsStateService: ChartSettingsStateService) { }

  async ngOnInit(): Promise<void> {
    this.chartConfig = { ...chartConfigs.temperature };
    this.chartSettingsStateService.stateChanged.subscribe(state => {
      this.weatherChart = state.weatherChart;
      this.updateChartData();
    });
    this.weatherStateService.stateChanged.subscribe(state => {
      this.isLoading = state.isLoading;
      this.labels = state.dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? 'unknown');
      this.updateChartData();
    });
  }

  private updateChartData(): void {
    if (!this.isLoading && this.weatherChart) {
      switch (this.weatherChart) {
        case WeatherChart.Temperature:
          this.chartConfig = { ...chartConfigs.temperature };
          this.chartConfig.data.data = this.weatherStateService.getTemperaturesAverage();
          break;
        case WeatherChart.HumidityRelative:
          this.chartConfig = { ...chartConfigs.humidityRelative };
          this.chartConfig.data.data = this.weatherStateService.getHumiditiesRelativeAverage();
          break;
        case WeatherChart.HumiditySpecific:
          this.chartConfig = { ...chartConfigs.humiditySpecific };
          this.chartConfig.data.data = this.weatherStateService.getHumiditiesSpecificAverage();
          break;
      }
    }
  }
}
