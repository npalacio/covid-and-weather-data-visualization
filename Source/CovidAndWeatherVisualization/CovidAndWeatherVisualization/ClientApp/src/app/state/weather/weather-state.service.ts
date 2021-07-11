import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { WeatherChartEnum, WeatherData } from 'src/app/shared/models';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';
import { SelectedData } from 'src/app/shared/models/selected-weather-data';
import { ChartSettingsStateService, CountyStateService, WeatherDataService } from '..';
import { AggregationService } from '../services/aggregation.service';
import { WeatherState } from './weather-state.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherStateService extends ObservableStore<WeatherState> {
  private startDate?: Date;
  private endDate?: Date;
  private latitude?: number;
  private longitude?: number;
  private weatherChart?: WeatherChartEnum;
  private dataPointAggregation?: DataPointAggregationEnum;

  constructor(private chartSettingsStateService: ChartSettingsStateService
            , private weatherDataService: WeatherDataService
            , private countyStateService: CountyStateService
            , private aggregationService: AggregationService) {
    super({});
    const initialState: WeatherState = {
      weatherData: [],
      selectedWeatherData: [],
      isLoading: false
    };
    this.setState(initialState, 'INIT_STATE');
    this.chartSettingsStateService.stateChanged.subscribe(async state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
      this.weatherChart = state.weatherChart;
      this.dataPointAggregation = state.dataPointAggregation;
      await this.updateState('DATE_RANGE_UPDATE');
    });
    this.countyStateService.stateChanged.subscribe(async state => {
      this.latitude = state.selectedCounty?.center?.latitdue;
      this.longitude = state.selectedCounty?.center?.longitude;
      await this.updateState('LAT_LONG_UPDATE');
    });
  }

  private async updateState(action: string): Promise<void> {
    if (this.latitude && this.longitude && this.startDate && this.endDate) {
      this.setState({ isLoading: true }, `${action}_LOADING`);
      const weatherData = await this.weatherDataService.getTemperatureData({
        startDate: this.startDate,
        endDate: this.endDate,
        latitude: this.latitude,
        longitude: this.longitude
      });
      const selectedWeatherData = this.getSelectedWeatherData(weatherData, this.startDate, this.weatherChart, this.dataPointAggregation);
      this.setState({
        isLoading: false,
        weatherData,
        selectedWeatherData
      }, `${action}_LOADING_COMPLETE`);
    }
  }

  private getSelectedWeatherData(weatherData: WeatherData[], startDate: Date, selectedWeatherChart?: WeatherChartEnum, dataPointAggregation?: DataPointAggregationEnum): SelectedData[] {
    let selectedWeatherData: SelectedData[] = [];
    switch (selectedWeatherChart) {
      case WeatherChartEnum.Temperature:
        selectedWeatherData = weatherData.map(wd => ({
          date: wd.date,
          value: wd.temperatureAverage
        }));
        break;
      case WeatherChartEnum.HumidityRelative:
        selectedWeatherData = weatherData.map(wd => ({
          date: wd.date,
          value: wd.humidityRelativeAverage
        }));
        break;
      case WeatherChartEnum.HumiditySpecific:
        selectedWeatherData = weatherData.map(wd => ({
          date: wd.date,
          value: wd.humiditySpecificAverage
        }));
        break;
    }
    switch (dataPointAggregation) {
      case DataPointAggregationEnum.WeeklyAverage:
        selectedWeatherData = this.aggregationService.getWeeklyAverages(selectedWeatherData, startDate);
        break;
    }
    return selectedWeatherData;
  }
}
