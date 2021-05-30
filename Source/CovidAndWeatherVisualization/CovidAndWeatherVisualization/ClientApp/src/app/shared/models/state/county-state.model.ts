import { County } from '.';

export interface CountyState {
  countySearchResults: County[];
  selectedCounty?: County;
}
