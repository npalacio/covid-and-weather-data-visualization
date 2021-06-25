import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WeatherChart } from 'src/app/shared/models';

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

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.radioSelected = this.weatherChartTypes[1].value;
  }

  dismissModal() {
    this.activeModal.dismiss();
  }
}
