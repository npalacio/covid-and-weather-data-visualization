import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { WeatherChart } from 'src/app/shared/models';
import { ChartSettingsStateService } from 'src/app/state';
import { WeatherStateService } from 'src/app/state/weather/weather-state.service';
import { chartConfigs } from '../charts-config';

@Component({
  selector: 'app-chart-scatter',
  templateUrl: './chart-scatter.component.html',
  styleUrls: ['./chart-scatter.component.scss']
})
export class ChartScatterComponent implements OnInit {
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;
  weatherChart?: WeatherChart;

  constructor(private datePipe: DatePipe
            , private weatherStateService: WeatherStateService
            , private chartSettingsStateService: ChartSettingsStateService) { }

  async ngOnInit(): Promise<void> {
    this.chartConfig = { ...chartConfigs.scatter };
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
          this.chartConfig.data.data = this.weatherStateService.getTemperaturesAverage();
          break;
        case WeatherChart.HumidityRelative:
          this.chartConfig.data.data = this.weatherStateService.getHumiditiesRelativeAverage();
          break;
        case WeatherChart.HumiditySpecific:
          this.chartConfig.data.data = this.weatherStateService.getHumiditiesSpecificAverage();
          break;
      }
    }
  }
}
