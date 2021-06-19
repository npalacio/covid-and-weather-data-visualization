import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { ChartState } from './chart-state.model';

@Injectable({
  providedIn: 'root'
})
export class ChartStateService extends ObservableStore<ChartState> {

  constructor() {
    const initialState: ChartState = {
      startDate: undefined,
      endDate: undefined
    };
    super({});
    this.setState(initialState, 'INIT_STATE');
  }

  setStartDate(startDate: Date): void {
    this.setState({ startDate }, 'SET_START_DATE');
  }

  setEndDate(endDate: Date): void {
    this.setState({ endDate }, 'SET_END_DATE');
  }
}
