import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { ChartSettingsStateService } from '../chart/chart-settings-state.service';
import { CountyStateService } from '../county/county-state.service';
import { CovidDataService } from '../services/covid-data.service';
import { CovidState } from './covid-state.model';

@Injectable({
  providedIn: 'root'
})
export class CovidStateService extends ObservableStore<CovidState> {
  private startDate?: Date;
  private endDate?: Date;
  private fips?: number;

  constructor(private chartSettingsStateService: ChartSettingsStateService
            , private covidDataService: CovidDataService
            , private countyStateService: CountyStateService) {
    super({});
    const initialState: CovidState = {
      isLoading: false,
      dataByCounty: [],
      dates: [],
      casesNew: []
    };
    this.setState(initialState, 'INIT_STATE');
    this.chartSettingsStateService.dateRangeUpdates$.subscribe(async state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
      await this.updateState('DATE_RANGE_UPDATE');
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
      const dates = dataByCounty.map(_ => _.date);
      const casesNew = dataByCounty.map(_ => _.casesNew);
      this.setState({
        isLoading: false,
        dataByCounty,
        dates,
        casesNew
      }, `${action}_LOADING_COMPLETE`);
    }
  }
}
