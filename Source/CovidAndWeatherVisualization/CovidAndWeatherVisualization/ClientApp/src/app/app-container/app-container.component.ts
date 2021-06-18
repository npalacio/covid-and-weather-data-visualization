import { Component, OnInit } from '@angular/core';
import { CountyState, CountyStateService } from 'src/app/state';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss']
})
export class AppContainerComponent implements OnInit {
  isPanelVisible = false;
  areChartsVisible = false;

  constructor(private countyStateService: CountyStateService) { }

  ngOnInit(): void {
    this.countyStateService.stateChanged.subscribe((countyState: CountyState) => {
      if (countyState.selectedCounty) {
        this.isPanelVisible = true;
        this.areChartsVisible = true;
      }
    });
  }

  hideCharts(): void {
    this.areChartsVisible = false;
  }

  showCharts(): void {
    this.areChartsVisible = true;
  }

}
