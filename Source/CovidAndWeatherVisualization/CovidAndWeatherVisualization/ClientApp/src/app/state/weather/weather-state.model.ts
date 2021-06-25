import { WeatherData } from 'src/app/shared/models';

export interface WeatherState {
  temperatureData: WeatherData[];
  dates: Date[];
  temperaturesAverage: number[];
  humiditiesRelativeAverage: number[];
  humiditiesSpecificAverage: number[];
  isLoading: boolean;
}
