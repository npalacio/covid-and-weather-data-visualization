import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableStore } from '@codewithdan/observable-store';
import { County, CountyState } from '../../shared/models/state';
import { initialCountyState } from './county-state.initial';

@Injectable({
  providedIn: 'root'
})
export class CountyStateService extends ObservableStore<CountyState> {

  // Potential Issue: Need to expose an observable that only fires when a particular property in state has actually changed
  // Potential Solution 1: Get away from updating state with lambda, just call getState and modify result and set state again
    // Then I could use observable with properties that were changed in state
  // Potential Solution 2: Pipe stateChanged observable and filter accordingly?

  // Note: ObservableStore does not seem to be able to work with properties in state that are ESRI types with functions as properties
    // i.e. It errors out when I try to put an ESRI Geometry, FeatureLayer type in state

  constructor(private router: Router) {
    super({});
    this.setState(initialCountyState, 'INIT_STATE');
  }

  getCountySearchResults(): County[] {
    return this.getStateProperty<County[]>('countySearchResults');
  }

  setCountySearchResults(counties: County[]): void {
    this.setState({countySearchResults: counties}, 'UPDATE_COUNTY_SEARCH_RESULTS');
  }

  setSelectedCounty(county: County): void {
    this.router.navigateByUrl(`/counties/${county.fips}`);
    this.setState({selectedCounty: county}, 'UPDATE_SELECTED_COUNTY');
  }
}
