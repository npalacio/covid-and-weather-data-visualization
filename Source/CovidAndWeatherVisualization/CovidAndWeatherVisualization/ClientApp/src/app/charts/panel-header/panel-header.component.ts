import { Component, OnInit } from '@angular/core';
import { County } from 'src/app/shared/models';
import { CountyState, CountyStateService, ChartSettingsStateService } from 'src/app/state';

@Component({
  selector: 'app-panel-header',
  templateUrl: './panel-header.component.html',
  styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent implements OnInit {
  dateFormat = 'MM/dd/yyyy';
  selectedCounty?: County;
  startDate?: Date;
  endDate?: Date;

  constructor(private countyStateService: CountyStateService, private chartSettingsStateService: ChartSettingsStateService) { }

  ngOnInit(): void {
    this.countyStateService.stateChanged.subscribe((countyState: CountyState) => {
      this.selectedCounty = countyState.selectedCounty;
    });
    this.chartSettingsStateService.stateChanged.subscribe(state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
    });
  }
}
