import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/app/shared/models/constants.model';
import { CovidDataByCounty } from 'src/app/shared/models/covid-data-by-county.model';
import { TemperatureData } from '../../shared/models/temperature-data';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  dateFormatQueryString = 'MM-dd-yyyy';

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) {
  }

  getTemperatureData(query: TemperatureDataQuery): Promise<TemperatureData[]> {
    return this.httpClient.get<TemperatureData[]>(BASE_URL + `Weather?startDate=${this.datePipe.transform(query.startDate, this.dateFormatQueryString)}&endDate=${this.datePipe.transform(query.endDate, this.dateFormatQueryString)}&latitude=${query.latitude}&longitude=${query.longitude}`).toPromise();
  }
}

export interface TemperatureDataQuery {
  startDate: Date;
  endDate: Date;
  latitude: number;
  longitude: number;
}
