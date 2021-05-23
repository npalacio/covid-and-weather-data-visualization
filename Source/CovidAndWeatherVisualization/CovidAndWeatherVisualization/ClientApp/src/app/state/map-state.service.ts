import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { County, MapState } from '../shared/models/state';
import { initialMapState } from './map-state.initial';

@Injectable({
  providedIn: 'root'
})
export class MapStateService extends ObservableStore<MapState> {

  constructor() {
    super({});
    this.setState(initialMapState, 'INIT_STATE');
  }

  get(): MapState {
    return this.getState();
  }

  setCountySearchResults(counties: County[]) {
    this.setState(prevState => {
      return {
        ...prevState,
        countySearchResults: counties
      };
    }, 'UPDATE_COUNTY_SEARCH_RESULTS');
  }
}
