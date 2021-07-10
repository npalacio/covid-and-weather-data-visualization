import { Injectable } from '@angular/core';
import { SelectedWeatherData } from 'src/app/shared/models/selected-weather-data';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  constructor() {
  }
  // Assumptions: data is sorted by date and has no gaps
  getWeeklyAverages(data: SelectedWeatherData[]): SelectedWeatherData[] {
    const weeklyAverages: SelectedWeatherData[] = [];
    const numberOfWeeks = Math.floor(data.length/7);
    for (let i = 0; i < numberOfWeeks; i++) {
      const endIndex = i + 7;
      const currentWeekValues = data.slice(i, endIndex).filter(d => d.value).map(d => d.value);
      weeklyAverages.push({
        date: data[endIndex].date,
        value: currentWeekValues.reduce((a, b) => a + b, 0)
      });
    }
    return weeklyAverages;
  }
}
