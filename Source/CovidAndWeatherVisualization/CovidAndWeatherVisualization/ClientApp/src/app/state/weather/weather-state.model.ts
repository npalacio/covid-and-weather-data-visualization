import { TemperatureData } from "src/app/shared/models";

export interface WeatherState {
  temperatureData: TemperatureData[];
  isLoading: boolean;
}
