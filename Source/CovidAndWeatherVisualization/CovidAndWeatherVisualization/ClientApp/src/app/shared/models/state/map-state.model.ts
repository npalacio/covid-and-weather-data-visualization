import { County } from '.';

export interface MapState {
  basemap: string;
  center: number[];
  zoom: number;
  layerConfigs: any[];
  countySearchResults: County[];
}
