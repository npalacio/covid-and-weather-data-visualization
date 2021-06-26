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
  xAxisLabel: 'Average Temperature' | 'Average Relative Humidity' | 'Average Specific Humidity' = 'Average Temperature';
  chartTitle: 'Covid Infections vs Temperature' | 'Covid Infections vs Relative Humidity' | 'Covid Infections vs Specific Humidity' = 'Covid Infections vs Temperature';
  covidDataCasesNew: CovidDataByCounty[] = [];
  weatherData: WeatherData[] = [];

  constructor(private weatherStateService: WeatherStateService
    , private chartSettingsStateService: ChartSettingsStateService
    , private covidStateService: CovidStateService) {
    this.chartConfig = { ...chartConfigs.scatter };
  }

  async ngOnInit(): Promise<void> {
    // TODO: Combine these observables so we dont have to hold onto so much state
    this.chartSettingsStateService.stateChanged.subscribe(state => {
      switch (state.weatherChart) {
        case WeatherChart.Temperature:
          this.weatherDataPointIndex = 'temperatureAverage';
          this.xAxisLabel = 'Average Temperature';
          this.chartTitle = 'Covid Infections vs Temperature';
          break;
        case WeatherChart.HumidityRelative:
          this.weatherDataPointIndex = 'humidityRelativeAverage';
          this.xAxisLabel = 'Average Relative Humidity';
          this.chartTitle = 'Covid Infections vs Relative Humidity';
          break;
        case WeatherChart.HumiditySpecific:
          this.weatherDataPointIndex = 'humiditySpecificAverage';
          this.xAxisLabel = 'Average Specific Humidity';
          this.chartTitle = 'Covid Infections vs Specific Humidity';
          break;
      }
      this.updateChartData();
    });
    this.weatherStateService.stateChanged.subscribe(state => {
      this.isWeatherLoading = state.isLoading;
      this.weatherData = state.weatherData;
      this.updateChartData();
    });
    this.covidStateService.stateChanged.subscribe(state => {
      this.isCovidLoading = state.isLoading;
      this.covidDataCasesNew = state.dataByCounty;
      this.updateChartData();
    });
  }

  updateChartData() {
    if (!this.isLoading) {
      const covidDateMap: any = {};
      this.covidDataCasesNew.forEach(c => {
        covidDateMap[new Date(c.date).toLocaleDateString('en-US')] = c.casesNew;
      });
      this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = this.xAxisLabel;
      this.chartConfig.options.title.text = this.chartTitle;
      const chartData = this.weatherData.filter(w => covidDateMap[new Date(w.date).toLocaleDateString('en-US')]).map(w => {
        return {
          x: w[this.weatherDataPointIndex],
          y: covidDateMap[new Date(w.date).toLocaleDateString('en-US')]
        };
      });
      this.chartConfig.data.data = chartData;
    }
  }

  get isLoading() {
    return this.isCovidLoading || this.isWeatherLoading;
  }
}
