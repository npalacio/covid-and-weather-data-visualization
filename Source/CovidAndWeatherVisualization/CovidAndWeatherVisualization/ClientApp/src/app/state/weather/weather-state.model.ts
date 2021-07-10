import { WeatherData } from 'src/app/shared/models';
import { SelectedWeatherData } from 'src/app/shared/models/selected-weather-data';

export interface WeatherState {
  weatherData: WeatherData[];
  dates: Date[];
  selectedWeatherData: SelectedWeatherData[];
  isLoading: boolean;
}
