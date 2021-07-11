import { WeatherData } from 'src/app/shared/models';
import { SelectedData } from 'src/app/shared/models/selected-weather-data';

export interface WeatherState {
  weatherData: WeatherData[];
  dates: Date[];
  selectedWeatherData: SelectedData[];
  isLoading: boolean;
}
