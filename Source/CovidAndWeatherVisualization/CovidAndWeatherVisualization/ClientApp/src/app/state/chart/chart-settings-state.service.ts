import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableStore } from '@codewithdan/observable-store';
import { ChartState } from './chart-settings-state.model';
import { WEATHER_CHART_TYPES } from '../../shared/models/constants.model';

@Injectable({
  providedIn: 'root'
})
export class ChartSettingsStateService extends ObservableStore<ChartState> {
  private startDateDefault: Date = new Date(2020, 0, 1);
  private endDateDefault: Date = new Date(2021, 0, 1);
  private weatherChartTypeDefault: number = 0;
  private dateFormatUrl = 'MM-dd-yyyy';

  constructor(private datePipe: DatePipe, private router: Router) {
    super({});
    const initialState: ChartState = {
      startDate: undefined,
      endDate: undefined
    };
    this.setState(initialState, 'INIT_STATE');
  }

  syncDataInUrl(startDateUrlParam: string, endDateUrlParam: string, weatherChartTypeUrlParam: string | null): void {
    weatherChartTypeUrlParam = weatherChartTypeUrlParam ?? 'not a number';
    let startDate = this.startDateDefault;
    let endDate = this.endDateDefault;
    let weatherChartType = this.weatherChartTypeDefault;

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

    if(!isNaN(+weatherChartTypeUrlParam)) {
      const weatherChartTypeUrlParamNum = +weatherChartTypeUrlParam;
      if(weatherChartTypeUrlParamNum >= 0 && weatherChartTypeUrlParamNum < WEATHER_CHART_TYPES.length) {
        // Valid chart type in URL
        weatherChartType = weatherChartTypeUrlParamNum;
      }
    }

    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(startDate, this.dateFormatUrl),
        endDate: this.datePipe.transform(endDate, this.dateFormatUrl),
        weatherChart: weatherChartType
      },
      queryParamsHandling: 'merge'
    });
    this.setState({startDate, endDate}, 'SYNC_DATES_WITH_URL');
  }
}
