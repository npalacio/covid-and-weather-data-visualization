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
  weatherChartTypes: any[] = [
    {
      name: 'Temperature',
      value: WeatherChart.Temperature
    },
    {
      name: 'Humidity',
      value: WeatherChart.Humidity
    }
  ];

  radioSelected: WeatherChart = WeatherChart.Temperature;

  constructor(private activeModal: NgbActiveModal, private chartSettingsStateService: ChartSettingsStateService) { }

  ngOnInit(): void {
  }

  update(): void {
    console.log(this.radioSelected);
    this.chartSettingsStateService.updateWeatherChartType(this.radioSelected);
    this.dismissModal();
  }

  dismissModal() {
    this.activeModal.dismiss();
  }
}
