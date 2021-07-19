import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WeatherChartEnum } from 'src/app/shared/models';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';
import { ChartSettingsStateService } from 'src/app/state';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss']
})
export class ChartSettingsComponent implements OnInit {
  // Weather Chart
  weatherChartTypes: any[] = [{
    name: 'Temperature',
    value: WeatherChartEnum.Temperature
  }, {
    name: 'Specific Humidity',
    value: WeatherChartEnum.HumiditySpecific
  }, {
    name: 'Relative Humidity',
    value: WeatherChartEnum.HumidityRelative
  }];
  selectedWeatherChart: WeatherChartEnum = WeatherChartEnum.Temperature;

  // Data Point Aggregation
  dataPointAggrTypes: any[] = [{
    name: 'Daily',
    value: DataPointAggregationEnum.Daily
  }, {
    name: 'Weekly Average',
    value: DataPointAggregationEnum.WeeklyAverage
  }, {
    name: '7 Day Rolling Average',
    value: DataPointAggregationEnum.SevenDayRollingAverage
  }];
  selectedDataPointAggr: DataPointAggregationEnum = DataPointAggregationEnum.Daily;

  // Dates
  startDate: NgbDateStruct = { year: 2020, month: 3, day: 1 };
  endDate: NgbDateStruct = { year: 2021, month: 1, day: 1 };

  constructor(private activeModal: NgbActiveModal, private chartSettingsStateService: ChartSettingsStateService) { }

  ngOnInit(): void {
    const currentState = this.chartSettingsStateService.getCurrentState();
    this.selectedWeatherChart = currentState.weatherChart;
    this.selectedDataPointAggr = currentState.dataPointAggregation;
    if (currentState.startDate && currentState.endDate) {
      this.startDate = {
        year: currentState.startDate.getFullYear(),
        month: currentState.startDate.getMonth() + 1,
        day: currentState.startDate.getDate()
      };
      this.endDate = {
        year: currentState.endDate.getFullYear(),
        month: currentState.endDate.getMonth() + 1,
        day: currentState.endDate.getDate()
      };
    }
  }

  update(): void {
    this.chartSettingsStateService.updateChartSettings({
      weatherChart: this.selectedWeatherChart,
      dataPointAggregation: this.selectedDataPointAggr,
      startDate: new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day),
      endDate: new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day)
    });
    this.dismissModal();
  }

  dismissModal(): void {
    this.activeModal.dismiss();
  }
}
