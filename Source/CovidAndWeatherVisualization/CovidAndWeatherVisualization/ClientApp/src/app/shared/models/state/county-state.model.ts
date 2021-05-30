import { County } from '.';

export interface CountyState {
  countySearchResults: County[];
  selectedCountyFips?: number;
}
