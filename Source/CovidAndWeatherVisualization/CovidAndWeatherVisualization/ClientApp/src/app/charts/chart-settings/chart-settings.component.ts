import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WeatherChart } from 'src/app/shared/models';
import { ChartSettingsStateService } from 'src/app/state';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss']
})
export class ChartSettingsComponent implements OnInit {
  weatherChartTypes: any[] = [];

  selectedWeatherChart: WeatherChart = WeatherChart.Temperature;

  constructor(private activeModal: NgbActiveModal, private chartSettingsStateService: ChartSettingsStateService) { }

  ngOnInit(): void {
    this.selectedWeatherChart = this.chartSettingsStateService.getSelectedWeatherChart();
    this.weatherChartTypes = Object.keys(WeatherChart).map((key: any) => {
      return WeatherChart[key];
    }).filter(value => typeof value === 'number').map(key => {
      return {
        name: WeatherChart[+key],
        value: +key
      };
    });
  }

  update(): void {
    this.chartSettingsStateService.updateWeatherChartType(this.selectedWeatherChart);
    this.dismissModal();
  }

  dismissModal(): void {
    this.activeModal.dismiss();
  }
}
