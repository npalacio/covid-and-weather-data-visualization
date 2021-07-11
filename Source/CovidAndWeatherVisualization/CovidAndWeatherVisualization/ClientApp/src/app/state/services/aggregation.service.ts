import { Injectable } from '@angular/core';
import { SelectedData } from 'src/app/shared/models/selected-weather-data';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  constructor() {
  }

  // Assumptions: data is sorted by date and has no gaps
  getWeeklyAverages(data: SelectedData[], startDate: Date): SelectedData[] {
    startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDay()));
    const weeklyAverages: SelectedData[] = [];
    const startDayIndex = data.findIndex(_ => new Date(_.date).getTime() === startDate?.getTime());
    const numberOfWeeks = Math.floor((data.length - startDayIndex)/7);
    console.log('start day index = ' + startDayIndex);
    for (let currentWeek = 0; currentWeek < numberOfWeeks; currentWeek++) {
      const startIndex = startDayIndex + currentWeek * 7;
      const endIndex = startIndex + 6;
      const currentWeekValues = data.slice(startIndex, endIndex + 1).filter(d => d.value).map(d => d.value);
      weeklyAverages.push({
        date: data[endIndex].date,
        value: +(currentWeekValues.reduce((a, b) => a + b, 0) / 7).toFixed(1)
      });
    }
    return weeklyAverages;
  }
}
