import { WeatherData } from 'src/app/shared/models';

export interface WeatherState {
  weatherData: WeatherData[];
  dates: Date[];
  temperaturesAverage: number[];
  humiditiesRelativeAverage: number[];
  humiditiesSpecificAverage: number[];
  isLoading: boolean;
}
