import { CovidDataByCounty } from 'src/app/shared/models';
import { SelectedData } from 'src/app/shared/models/selected-weather-data';

export interface CovidState {
  isLoading: boolean;
  dataByCounty: CovidDataByCounty[];
  selectedCovidData: SelectedData[];
}
