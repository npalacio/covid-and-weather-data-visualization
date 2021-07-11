import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';
import { SelectedData } from 'src/app/shared/models/selected-weather-data';
import { ChartSettingsStateService } from '../chart/chart-settings-state.service';
import { CountyStateService } from '../county/county-state.service';
import { AggregationService } from '../services/aggregation.service';
import { CovidDataService } from '../services/covid-data.service';
import { CovidState } from './covid-state.model';

@Injectable({
  providedIn: 'root'
})
export class CovidStateService extends ObservableStore<CovidState> {
  private startDate?: Date;
  private endDate?: Date;
  private fips?: number;
  private dataPointAggregation?: DataPointAggregationEnum;

  constructor(private chartSettingsStateService: ChartSettingsStateService
            , private covidDataService: CovidDataService
            , private countyStateService: CountyStateService
            , private aggregationService: AggregationService) {
    super({});
    const initialState: CovidState = {
      isLoading: false,
      dataByCounty: [],
      selectedCovidData: []
    };
    this.setState(initialState, 'INIT_STATE');
    this.chartSettingsStateService.covidChartSettingsUpdates$.subscribe(async state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
      this.dataPointAggregation = state.dataPointAggregation;
      await this.updateState('CHART_SETTINGS_UPDATE');
    });
    this.countyStateService.stateChanged.subscribe(async state => {
      this.fips = state.selectedCounty?.fips;
      await this.updateState('FIPS_UPDATE');
    });
  }

  private async updateState(action: string): Promise<void> {
    if (this.fips && this.startDate && this.endDate) {
      this.setState({isLoading: true}, `${action}_LOADING`);
      const dataByCounty = await this.covidDataService.getCovidDataByCounty({
        fips: this.fips,
        startDate: this.startDate,
        endDate: this.endDate
      });
      let selectedCovidData: SelectedData[] = dataByCounty.map(_ => ({date: _.date, value: _.casesNew}));
      switch (this.dataPointAggregation) {
        case DataPointAggregationEnum.WeeklyAverage:
          selectedCovidData = this.aggregationService.getWeeklyAverages(selectedCovidData);
          break;
      }
      this.setState({
        isLoading: false,
        dataByCounty,
        selectedCovidData
      }, `${action}_LOADING_COMPLETE`);
    }
  }
}
