import { WeatherChartEnum } from 'src/app/shared/models';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';

export interface ChartState {
  startDate?: Date;
  endDate?: Date;
  weatherChart: WeatherChartEnum;
  dataPointAggregation: DataPointAggregationEnum;
}
