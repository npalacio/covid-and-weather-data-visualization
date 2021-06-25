import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
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

  constructor(private chartSettingsStateService: ChartSettingsStateService
    , private weatherDataService: WeatherDataService
    , private countyStateService: CountyStateService) {
    super({});
    const initialState: WeatherState = {
      temperatureData: [],
      dates: [],
      temperaturesAverage: [],
      humiditiesRelativeAverage: [],
      humiditiesSpecificAverage: [],
      isLoading: false
    };
    this.setState(initialState, 'INIT_STATE');
    this.chartSettingsStateService.stateChanged.subscribe(async state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
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
      const temperatureData = await this.weatherDataService.getTemperatureData({
        startDate: this.startDate,
        endDate: this.endDate,
        latitude: this.latitude,
        longitude: this.longitude
      });
      const dates = temperatureData.map(_ => _.date);
      const temperaturesAverage = temperatureData.map(_ => _.temperatureAverage);
      const humiditiesRelativeAverage = temperatureData.map(_ => _.humidityRelativeAverage);
      const humiditiesSpecificAverage = temperatureData.map(_ => _.humiditySpecificAverage);
      this.setState({
        isLoading: false,
        temperatureData,
        dates,
        temperaturesAverage,
        humiditiesRelativeAverage,
        humiditiesSpecificAverage
      }, `${action}_LOADING_COMPLETE`);
    }
  }

  getTemperaturesAverage(): number[] {
    return this.getState().temperaturesAverage;
  }

  getHumiditiesRelativeAverage(): number[] {
    return this.getState().humiditiesRelativeAverage;
  }

  getHumiditiesSpecificAverage(): number[] {
    return this.getState().humiditiesSpecificAverage;
  }
}
