import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { County, MapState } from '../../shared/models/state';
import { MapConfig } from '../../shared/models/state/map-config.model';
import { initialMapState } from './map-state.initial';

@Injectable({
  providedIn: 'root'
})
export class MapStateService extends ObservableStore<MapState> {

  // Potential Issue: Need to expose an observable that only fires when a particular property in state has actually changed
  // Potential Solution 1: Get away from updating state with lambda, just call getState and modify result and set state again
    // Then I could use observable with properties that were changed in state
  // Potential Solution 2: Pipe stateChanged observable and filter accordingly?

  // Note: ObservableStore does not seem to be able to work with properties in state that are ESRI types with functions as properties
    // i.e. It errors out when I try to put an ESRI Geometry, FeatureLayer type in state

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
    this.setState({countySearchResults: counties}, 'UPDATE_COUNTY_SEARCH_RESULTS');
  }

  setSelectedCounty(county: County): void {
    this.setState({selectedCounty: county}, 'UPDATE_SELECTED_COUNTY');
  }
}
