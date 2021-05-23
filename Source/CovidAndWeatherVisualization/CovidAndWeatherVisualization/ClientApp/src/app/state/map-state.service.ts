import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { MapState } from '../shared/models/state';
import { initialMapState } from './map-state.initial';

@Injectable({
  providedIn: 'root'
})
export class MapStateService extends ObservableStore<MapState> {

  constructor() {
    super({});
    this.setState(initialMapState, 'INIT_STATE');
  }

  get() {
    return this.getState();
  }
}
