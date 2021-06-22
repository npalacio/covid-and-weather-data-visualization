import { WeatherChart } from "src/app/shared/models";

export interface ChartState {
  startDate?: Date;
  endDate?: Date;
  weatherChart: WeatherChart;
}
