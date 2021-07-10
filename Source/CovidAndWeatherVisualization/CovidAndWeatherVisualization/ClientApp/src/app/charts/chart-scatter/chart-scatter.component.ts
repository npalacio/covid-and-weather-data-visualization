import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CovidDataByCounty, WeatherChart, WeatherData } from 'src/app/shared/models';
import { SelectedWeatherData } from 'src/app/shared/models/selected-weather-data';
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
  isLoading = false;

  constructor(private weatherStateService: WeatherStateService
    ,         private chartSettingsStateService: ChartSettingsStateService
    ,         private covidStateService: CovidStateService) {
    this.chartConfig = { ...chartConfigs.scatter };
  }

  async ngOnInit(): Promise<void> {
    combineLatest([this.chartSettingsStateService.stateChanged
      , this.weatherStateService.stateChanged
      , this.covidStateService.stateChanged]).subscribe(
        ([chartState, weatherState, covidState]) => {
          const chartTitle: string[] = [];
          switch (chartState.weatherChart) {
            case WeatherChart.Temperature:
              this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Average Temperature';
              chartTitle.push('Covid Infections vs Temperature');
              break;
            case WeatherChart.HumidityRelative:
              this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Average Relative Humidity';
              chartTitle.push('Covid Infections vs Relative Humidity');
              break;
            case WeatherChart.HumiditySpecific:
              this.chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Average Specific Humidity';
              chartTitle.push('Covid Infections vs Specific Humidity');
              break;
          }
          this.isLoading = covidState.isLoading || weatherState.isLoading;
          if (!this.isLoading) {
            const scatterChartData = this.getScatterChartData(covidState.dataByCounty, weatherState.selectedWeatherData);
            this.chartConfig.data.data = scatterChartData.chartData;
            const corrCoeff: number = jStat.corrcoeff(scatterChartData.xArr, scatterChartData.yArr);
            chartTitle.push('Correlation coefficient (Pearson): ' + corrCoeff.toFixed(2));
            this.chartConfig.options.title.text = chartTitle;
          }
        }
      );
  }

  getScatterChartData(covidDataByCounty: CovidDataByCounty[], weatherData: SelectedWeatherData[]): {
    xArr: number[];
    yArr: number[];
    chartData: {
      x: number; y: number
    }[]
  } {
    const covidDateMap: any = {};
    covidDataByCounty.forEach(c => {
      covidDateMap[new Date(c.date).toLocaleDateString('en-US')] = c.casesNew;
    });
    const returnValue: { xArr: number[]; yArr: number[]; chartData: { x: number; y: number }[] } = { xArr: [], yArr: [], chartData: [] };
    weatherData.filter(w => covidDateMap[new Date(w.date).toLocaleDateString('en-US')]).forEach(w => {
      const x = w.value;
      const y = +covidDateMap[new Date(w.date).toLocaleDateString('en-US')];
      returnValue.xArr.push(x);
      returnValue.yArr.push(y);
      returnValue.chartData.push({
        x,
        y
      });
    });
    return returnValue;
  }
}
