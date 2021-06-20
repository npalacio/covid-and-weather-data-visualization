import { CovidDataByCounty } from 'src/app/shared/models';

export interface CovidState {
  isLoading: boolean;
  dataByCounty: CovidDataByCounty[];
  dates: Date[];
  cases: number[];
}
