import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
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
  isWeatherLoading = false;
  isCovidLoading = false;
  chartConfig: any;
  weatherDataPointIndex: 'temperatureAverage' | 'humidityRelativeAverage' | 'humiditySpecificAverage' = 'temperatureAverage';
  covidDataCasesNew: CovidDataByCounty[] = [];
  weatherData: WeatherData[] = [];

  constructor(private weatherStateService: WeatherStateService
    , private chartSettingsStateService: ChartSettingsStateService
    , private covidStateService: CovidStateService) {
    this.chartConfig = { ...chartConfigs.scatter };
  }

  async ngOnInit(): Promise<void> {
    this.chartSettingsStateService.stateChanged.subscribe(state => {
      switch (state.weatherChart) {
        case WeatherChart.Temperature:
          this.weatherDataPointIndex = 'temperatureAverage';
          break;
        case WeatherChart.HumidityRelative:
          this.weatherDataPointIndex = 'humidityRelativeAverage';
          break;
        case WeatherChart.HumiditySpecific:
          this.weatherDataPointIndex = 'humiditySpecificAverage';
          break;
      }
    });
    this.weatherStateService.stateChanged.subscribe(state => {
      this.isWeatherLoading = state.isLoading;
      this.weatherData = state.weatherData;
    });
    this.covidStateService.stateChanged.subscribe(state => {
      this.isCovidLoading = state.isLoading;
      this.covidDataCasesNew = state.dataByCounty;
    });
  }

  updateChartData() {
    const covidDateMap: any = {};
    this.covidDataCasesNew.forEach(c => {
      covidDateMap[c.date.toLocaleDateString('en-US')] = c.casesNew;
    });
    this.chartConfig.data.data = this.weatherData.filter(w => covidDateMap[w.date.toLocaleDateString('en-US')]).map(w => {
      return {
        x: w[this.weatherDataPointIndex],
        y: covidDateMap[w.date.toLocaleDateString('en-US')]
      };
    });
  }
}
