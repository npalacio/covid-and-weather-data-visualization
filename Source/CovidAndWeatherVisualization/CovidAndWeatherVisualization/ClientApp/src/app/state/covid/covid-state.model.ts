import { CovidDataByCounty } from "src/app/shared/models";

export interface CovidState {
  dataByCounty: CovidDataByCounty[];
  dates: Date[];
  cases: number[];
}
