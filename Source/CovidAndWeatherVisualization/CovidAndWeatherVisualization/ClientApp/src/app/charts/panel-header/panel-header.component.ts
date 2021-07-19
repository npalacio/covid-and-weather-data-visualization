import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { County } from 'src/app/shared/models';
import { CountyState, CountyStateService, ChartSettingsStateService } from 'src/app/state';
import { ChartSettingsComponent } from '../chart-settings/chart-settings.component';

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

  constructor(private countyStateService: CountyStateService
    , private chartSettingsStateService: ChartSettingsStateService
    , private modalService: NgbModal) { }

  ngOnInit(): void {
    this.countyStateService.stateChanged.subscribe((countyState: CountyState) => {
      this.selectedCounty = countyState.selectedCounty;
    });
    this.chartSettingsStateService.stateChanged.subscribe(state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
    });
  }

  openChartSettings(): void {
    this.modalService.open(ChartSettingsComponent);
  }

  share(tooltip: any): void {
    navigator.clipboard.writeText(window.location.href);
    tooltip.open();
    setTimeout(() => {
      tooltip.close();
    }, 2000);
  }

}
