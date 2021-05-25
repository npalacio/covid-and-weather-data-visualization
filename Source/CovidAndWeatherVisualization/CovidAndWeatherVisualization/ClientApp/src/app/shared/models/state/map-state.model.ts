import { County } from '.';
import { MapConfig } from './map-config.model';

export interface MapState {
  mapConfig: MapConfig;
  countySearchResults: County[];
}
