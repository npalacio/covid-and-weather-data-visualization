import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Label } from 'ng2-charts';
import { CovidStateService } from 'src/app/state';
import { chartConfigs } from '../charts-config';

@Component({
  selector: 'app-chart-covid',
  templateUrl: './chart-covid.component.html',
  styleUrls: ['./chart-covid.component.scss']
})
export class ChartCovidComponent implements OnInit {
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;

  constructor(private datePipe: DatePipe, private covidStateService: CovidStateService) { }

  async ngOnInit(): Promise<void> {
    this.chartConfig = chartConfigs.covid;
    this.covidStateService.stateChanged.subscribe(state => {
      this.isLoading = state.isLoading;
      if (!this.isLoading) {
        this.chartConfig.data.data = state.casesNew;
        this.labels = state.dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? 'unknown');
      }
    });
  }
}
