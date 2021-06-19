import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableStore } from '@codewithdan/observable-store';
import { ChartState } from './chart-settings-state.model';

@Injectable({
  providedIn: 'root'
})
export class ChartSettingsStateService extends ObservableStore<ChartState> {
  private startDateDefault: Date = new Date(2020, 0, 1);
  private endDateDefault: Date = new Date(2021, 0, 1);
  private dateFormatUrl = 'MM-dd-yyyy';

  constructor(private datePipe: DatePipe, private router: Router) {
    super({});
    const initialState: ChartState = {
      startDate: undefined,
      endDate: undefined
    };
    this.setState(initialState, 'INIT_STATE');
  }

  syncDatesInUrl(startDateUrlParam: string, endDateUrlParam: string) {
    let startDate = this.startDateDefault;
    let endDate = this.endDateDefault;

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

    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(startDate, this.dateFormatUrl),
        endDate: this.datePipe.transform(endDate, this.dateFormatUrl)
      },
      queryParamsHandling: 'merge'
    });
    this.setState({startDate, endDate}, 'SYNC_DATES_WITH_URL');
  }
}
