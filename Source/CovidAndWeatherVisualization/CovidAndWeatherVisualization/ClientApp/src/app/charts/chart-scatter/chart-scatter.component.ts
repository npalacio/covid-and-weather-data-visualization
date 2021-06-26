import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { combineLatest } from 'rxjs';
import { CovidDataByCounty, WeatherChart, WeatherData } from 'src/app/shared/models';
import { ChartSettingsStateService, CovidStateService } from 'src/app/state';
import { WeatherStateService } from 'src/app/state/weather/weather-state.service';
import { chartConfigs } from '../charts-config';

@Component({
  selector: 'app-chart-scatter',
  templateUrl: './chart-scatter.component.html',
  styleUrls: ['./chart-scatter.component.scss']
})
export class ChartScatterComponent implements OnInit {
  chartConfig: any;
  weatherDataPointIndex: 'temperatureAverage' | 'humidityRelativeAverage' | 'humiditySpecificAverage' = 'temperatureAverage';
  isLoading: boolean = false;

  constructor(private weatherStateService: WeatherStateService
    , private chartSettingsStateService: ChartSettingsStateService
    , private covidStateService: CovidStateService) {
    this.chartConfig = { ...chartConfigs.scatter };
  }

  async ngOnInit(): Promise<void> {
    combineLatest([this.chartSettingsStateService.stateChanged, this.weatherStateService.stateChanged, this.covidStateService.stateChanged]).subscribe(
      ([chartState, weatherState, covidState]) => {
        switch (chartState.weatherChart) {
          case WeatherChart.Temperature:
            this.weatherDataPointIndex = 'temperatureAverage';
            this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Average Temperature';
            this.chartConfig.options.title.text = 'Covid Infections vs Temperature';
            break;
          case WeatherChart.HumidityRelative:
            this.weatherDataPointIndex = 'humidityRelativeAverage';
            this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Average Relative Humidity';
            this.chartConfig.options.title.text = 'Covid Infections vs Relative Humidity';
            break;
          case WeatherChart.HumiditySpecific:
            this.weatherDataPointIndex = 'humiditySpecificAverage';
            this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Average Specific Humidity';
            this.chartConfig.options.title.text = 'Covid Infections vs Specific Humidity';
            break;
        }
        this.isLoading = covidState.isLoading || weatherState.isLoading;
        if (!this.isLoading) {
          this.chartConfig.data.data = this.getChartData(covidState.dataByCounty, weatherState.weatherData);
        }
      }
    );
  }

  getChartData(covidDataByCounty: CovidDataByCounty[], weatherData: WeatherData[]): any[] {
    const covidDateMap: any = {};
    covidDataByCounty.forEach(c => {
      covidDateMap[new Date(c.date).toLocaleDateString('en-US')] = c.casesNew;
    });
    return weatherData.filter(w => covidDateMap[new Date(w.date).toLocaleDateString('en-US')]).map(w => {
      return {
        x: w[this.weatherDataPointIndex],
        y: covidDateMap[new Date(w.date).toLocaleDateString('en-US')]
      };
    });
  }
}
