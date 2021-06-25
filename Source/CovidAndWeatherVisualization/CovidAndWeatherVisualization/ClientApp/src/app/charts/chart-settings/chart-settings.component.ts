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
      value: WeatherChart[0]
    },
    {
      name: 'Humidity',
      value: WeatherChart[1]
    }
  ];

  radioSelected?:string;
  radioSelectedString?:string;

  constructor(private activeModal: NgbActiveModal, private chartSettingsStateService: ChartSettingsStateService) { }

  ngOnInit(): void {
    this.radioSelected = this.weatherChartTypes[1].value;
  }

  update(): void {
    this.chartSettingsStateService.updateWeatherChartType(this.weatherChartTypes.find(_ => _.value === this.radioSelected));
    this.dismissModal();
  }

  dismissModal() {
    this.activeModal.dismiss();
  }
}
