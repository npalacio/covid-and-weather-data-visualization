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
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;
  weatherChart?: WeatherChart;
  covidDataCasesNew: CovidDataByCounty[] = [];
  weatherData: WeatherData[] = [];

  constructor(private datePipe: DatePipe
    , private weatherStateService: WeatherStateService
    , private chartSettingsStateService: ChartSettingsStateService
    , private covidStateService: CovidStateService) {
    this.chartConfig = { ...chartConfigs.scatter };
  }

  async ngOnInit(): Promise<void> {
    this.chartSettingsStateService.stateChanged.subscribe(state => {
      this.weatherChart = state.weatherChart;
    });
    this.weatherStateService.stateChanged.subscribe(state => {
      this.isLoading = state.isLoading;
      this.labels = state.dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? 'unknown');
      this.weatherData = state.weatherData;
    });
    this.covidStateService.stateChanged.subscribe(state => {
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
        x: w.temperatureAverage,
        y: covidDateMap[w.date.toLocaleDateString('en-US')]
      };
    });
  }
}
