import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { County, MapState } from '../shared/models/state';
import { MapConfig } from '../shared/models/state/map-config.model';
import { initialMapState } from './map-state.initial';

@Injectable({
  providedIn: 'root'
})
export class MapStateService extends ObservableStore<MapState> {

  constructor() {
    super({});
    this.setState(initialMapState, 'INIT_STATE');
  }

  getMapConfig(): MapConfig {
    return this.getStateProperty<MapConfig>('mapConfig');
  }

  getCountySearchResults(): County[] {
    return this.getStateProperty<County[]>('countySearchResults');
  }

  setCountySearchResults(counties: County[]): void {
    this.setState(prevState => {
      return {
        ...prevState,
        countySearchResults: counties
      };
    }, 'UPDATE_COUNTY_SEARCH_RESULTS');
  }

  setSelectedCounty(county: County): void {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedCounty: county
      };
    }, 'UPDATE_SELECTED_COUNTY');
  }
}
