import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { WeatherChart, WeatherData } from 'src/app/shared/models';
import { SelectedWeatherData } from 'src/app/shared/models/selected-weather-data';
import { ChartSettingsStateService, CountyStateService, WeatherDataService } from '..';
import { WeatherState } from './weather-state.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherStateService extends ObservableStore<WeatherState> {
  private startDate?: Date;
  private endDate?: Date;
  private latitude?: number;
  private longitude?: number;
  private weatherChart?: WeatherChart;

  constructor(private chartSettingsStateService: ChartSettingsStateService
            , private weatherDataService: WeatherDataService
            , private countyStateService: CountyStateService) {
    super({});
    const initialState: WeatherState = {
      weatherData: [],
      dates: [],
      selectedWeatherData: [],
      isLoading: false
    };
    this.setState(initialState, 'INIT_STATE');
    this.chartSettingsStateService.stateChanged.subscribe(async state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
      this.weatherChart = state.weatherChart;
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
      const dates = weatherData.map(_ => _.date);
      const selectedWeatherData = this.getSelectedWeatherData(weatherData, this.weatherChart)
      this.setState({
        isLoading: false,
        weatherData,
        dates,
        selectedWeatherData
      }, `${action}_LOADING_COMPLETE`);
    }
  }

  getSelectedWeatherData(weatherData: WeatherData[], selectedWeatherChart?: WeatherChart): SelectedWeatherData[] {
    switch (selectedWeatherChart) {
      case WeatherChart.Temperature:
        return weatherData.map(wd => ({
          date: wd.date,
          value: wd.temperatureAverage
        }));
      case WeatherChart.HumidityRelative:
        return weatherData.map(wd => ({
          date: wd.date,
          value: wd.humidityRelativeAverage
        }));
      case WeatherChart.HumiditySpecific:
        return weatherData.map(wd => ({
          date: wd.date,
          value: wd.humiditySpecificAverage
        }));
    }
    return [];
  }
}
