import { Injectable } from '@angular/core';
import { SelectedData } from 'src/app/shared/models/selected-weather-data';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  constructor() {
  }

  // Assumptions: data is sorted by date and has no gaps
  getWeeklyAverages(data: SelectedData[]): SelectedData[] {
    const weeklyAverages: SelectedData[] = [];
    const numberOfWeeks = Math.floor(data.length/7);
    for (let currentWeek = 0; currentWeek < numberOfWeeks; currentWeek++) {
      const startIndex = currentWeek * 7;
      const endIndex = startIndex + 6;
      const currentWeekValues = data.slice(startIndex, endIndex + 1).filter(d => d.value).map(d => d.value);
      weeklyAverages.push({
        date: data[endIndex].date,
        value: currentWeekValues.reduce((a, b) => a + b, 0) / 7
      });
    }
    return weeklyAverages;
  }
}
