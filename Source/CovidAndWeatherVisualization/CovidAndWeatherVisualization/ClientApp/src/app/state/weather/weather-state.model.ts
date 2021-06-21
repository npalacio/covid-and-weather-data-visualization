import { TemperatureData } from 'src/app/shared/models';

export interface WeatherState {
  temperatureData: TemperatureData[];
  dates: Date[];
  temperaturesAverage: number[];
  isLoading: boolean;
}
