import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableStore } from '@codewithdan/observable-store';
import { ChartState } from './chart-settings-state.model';
import { WeatherChartEnum } from 'src/app/shared/models';
import { filter, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';

@Injectable({
  providedIn: 'root'
})
export class ChartSettingsStateService extends ObservableStore<ChartState> {
  private startDateDefault: Date = new Date(2020, 2, 1);
  private endDateDefault: Date = new Date(2021, 0, 1);
  private weatherChartTypeDefault: WeatherChartEnum = WeatherChartEnum.Temperature;
  private dataPointAggrDefault: DataPointAggregationEnum = DataPointAggregationEnum.Daily;
  private dateFormatUrl = 'MM-dd-yyyy';
  covidChartSettingsUpdates$: Observable<ChartState> = of();

  constructor(private datePipe: DatePipe, private router: Router) {
    super({});
    const initialState: ChartState = {
      startDate: undefined,
      endDate: undefined,
      weatherChart: WeatherChartEnum.Temperature,
      dataPointAggregation: DataPointAggregationEnum.Daily
    };
    this.setState(initialState, 'INIT_STATE');
    this.covidChartSettingsUpdates$ = this.stateWithPropertyChanges.pipe(filter(stateWithChanges => {
      if (stateWithChanges.stateChanges.endDate
        || stateWithChanges.stateChanges.startDate
        || stateWithChanges.stateChanges.dataPointAggregation) {
        return true;
      }
      return false;
    }), map(stateWithChanges => stateWithChanges.state));
  }

  syncDataInUrl(startDateUrlParam: string
    ,           endDateUrlParam: string
    ,           weatherChartTypeUrlParam: string | null
    ,           dataPointAggrUrlParam: string | null): void {
    weatherChartTypeUrlParam = weatherChartTypeUrlParam ?? 'not a number';
    dataPointAggrUrlParam = dataPointAggrUrlParam ?? 'not a number';
    let startDate = this.startDateDefault;
    let endDate = this.endDateDefault;
    let weatherChartType = this.weatherChartTypeDefault;
    let dataPointAggr = this.dataPointAggrDefault;

    const startDateFromUrl = new Date(startDateUrlParam);
    if (!isNaN(startDateFromUrl.getTime())) {
      // Valid start date in URL, use this
      startDate = startDateFromUrl;
    }

    const endDateFromUrl = new Date(endDateUrlParam);
    if (!isNaN(endDateFromUrl.getTime())) {
      // Valid end date in URL, use this
      endDate = endDateFromUrl;
    }

    if (!isNaN(+weatherChartTypeUrlParam)) {
      const weatherChartTypeUrlParamNum = +weatherChartTypeUrlParam;
      if (weatherChartTypeUrlParamNum in WeatherChartEnum) {
        // Valid chart type param in URL, use this
        weatherChartType = weatherChartTypeUrlParamNum;
      }
    }

    if (!isNaN(+dataPointAggrUrlParam)) {
      const dataPointAggrUrlParamNum = +dataPointAggrUrlParam;
      if (dataPointAggrUrlParamNum in DataPointAggregationEnum) {
        // Valid data point aggregation param in URL, use this
        dataPointAggr = dataPointAggrUrlParamNum;
      }
    }

    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(startDate, this.dateFormatUrl),
        endDate: this.datePipe.transform(endDate, this.dateFormatUrl),
        weatherChart: weatherChartType,
        dataPointAggregation: dataPointAggr
      },
      queryParamsHandling: 'merge'
    });
    this.setState({
      startDate,
      endDate,
      weatherChart: weatherChartType,
      dataPointAggregation: dataPointAggr
    }, 'SYNC_DATA_WITH_URL');
  }

  updateChartSettings(newChartState: ChartState): void {
    this.setState(newChartState);
    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(newChartState.startDate, this.dateFormatUrl),
        endDate: this.datePipe.transform(newChartState.endDate, this.dateFormatUrl),
        weatherChart: newChartState.weatherChart,
        dataPointAggregation: newChartState.dataPointAggregation
      },
      queryParamsHandling: 'merge'
    });
  }

  getCurrentState(): ChartState {
    return this.getState();
  }
}
