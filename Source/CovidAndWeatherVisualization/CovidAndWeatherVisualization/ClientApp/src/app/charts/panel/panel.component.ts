import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CovidStateService } from 'src/app/state';
import { WeatherStateService } from 'src/app/state/weather/weather-state.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  isCovidDataLoading = false;
  isWeatherDataLoading = false;
  constructor(private spinner: NgxSpinnerService
            , private weatherStateService: WeatherStateService
            , private covidStateService: CovidStateService) { }

  ngOnInit(): void {
    this.covidStateService.stateChanged.subscribe(state => {
      this.isCovidDataLoading = state.isLoading;
      this.checkSpinner();
    });
    this.weatherStateService.stateChanged.subscribe(state => {
      this.isWeatherDataLoading = state.isLoading;
      this.checkSpinner();
    });
  }

  private checkSpinner(): void {
    if (this.shouldShowSpinner) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

  private get shouldShowSpinner(): boolean {
    return this.isCovidDataLoading || this.isWeatherDataLoading;
  }
}
