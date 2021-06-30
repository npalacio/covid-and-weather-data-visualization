import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WeatherChart } from 'src/app/shared/models';
import { ChartSettingsStateService } from 'src/app/state';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss']
})
export class ChartSettingsComponent implements OnInit {
  weatherChartTypes: any[] = [{
    name: 'Temperature',
    value: WeatherChart.Temperature
  }, {
    name: 'Specific Humidity',
    value: WeatherChart.HumiditySpecific
  }, {
    name: 'Relative Humidity',
    value: WeatherChart.HumidityRelative
  }];
  selectedWeatherChart: WeatherChart = WeatherChart.Temperature;
  startDate: NgbDateStruct = { year: 2020, month: 3, day: 1 };
  endDate: NgbDateStruct = { year: 2021, month: 1, day: 1 };

  constructor(private activeModal: NgbActiveModal, private chartSettingsStateService: ChartSettingsStateService) { }

  ngOnInit(): void {
    const currentState = this.chartSettingsStateService.getCurrentState();
    this.selectedWeatherChart = currentState.weatherChart;
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
      startDate: new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day),
      endDate: new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day)
    });
    this.dismissModal();
  }

  dismissModal(): void {
    this.activeModal.dismiss();
  }
}
