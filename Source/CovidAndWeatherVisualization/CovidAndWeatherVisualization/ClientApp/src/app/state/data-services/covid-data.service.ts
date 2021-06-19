import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_URL } from "src/app/shared/models/constants.model";
import { CovidDataByCounty } from "src/app/shared/models/covid-data-by-county.model";

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  dateFormatQueryString = 'MM-dd-yyyy';

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) {
  }

  getCovidDataByCounty(query: CovidDataQuery): Promise<CovidDataByCounty[]> {
    return this.httpClient.get<CovidDataByCounty[]>(BASE_URL + `Covid?startDate=${this.datePipe.transform(query.startDate, this.dateFormatQueryString)}&endDate=${this.datePipe.transform(query.endDate, this.dateFormatQueryString)}&fips=${query.fips}`).toPromise();
  }
}

export interface CovidDataQuery {
  fips: number;
  startDate: Date;
  endDate: Date;
}
