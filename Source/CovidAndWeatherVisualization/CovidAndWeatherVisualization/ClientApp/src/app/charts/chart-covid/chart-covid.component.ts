import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Label } from 'ng2-charts';
import { ChartSettingsStateService, CovidStateService } from 'src/app/state';
import { chartConfigs } from '../charts-config';
import { combineLatest } from 'rxjs';
import { DataPointAggregationEnum } from 'src/app/shared/models/data-point-aggregation.enum';

@Component({
  selector: 'app-chart-covid',
  templateUrl: './chart-covid.component.html',
  styleUrls: ['./chart-covid.component.scss']
})
export class ChartCovidComponent implements OnInit {
  labels: Label[] = [];
  isLoading = false;
  chartConfig: any;

  constructor(private datePipe: DatePipe
    ,         private covidStateService: CovidStateService
    ,         private chartSettingsStateService: ChartSettingsStateService) { }

  async ngOnInit(): Promise<void> {
    this.chartConfig = { ...chartConfigs.covid };
    this.covidStateService.stateChanged.subscribe(state => {
    });
    combineLatest([this.chartSettingsStateService.stateChanged, this.covidStateService.stateChanged])
      .subscribe(([chartSettingsState, covidState]) => {
        this.isLoading = covidState.isLoading;
        if (!this.isLoading) {
          this.chartConfig.data.data = covidState.selectedCovidData.map(_ => _.value);
          this.labels = covidState.selectedCovidData.map(_ => _.date)
            .map(date => this.datePipe.transform(date, 'MM/dd', 'UTC') ?? 'unknown');
          switch (chartSettingsState.dataPointAggregation) {
            case DataPointAggregationEnum.Daily:
              this.chartConfig.options.title.text = 'Daily COVID Infections';
              break;
            case DataPointAggregationEnum.WeeklyAverage:
              this.chartConfig.options.title.text = 'Weekly Average COVID Infections';
              break;
          }
        }
      });
  }
}
