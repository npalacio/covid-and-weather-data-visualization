import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ChartSettingsStateService, CovidStateService } from 'src/app/state';
import { CovidDataService } from '../../state/data-services/covid-data.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  lineChartData: ChartDataSets[] = [
    { data: [], fill: false, pointRadius: 0, pointHitRadius: 2 }
  ];
  lineChartLabels: Label[] = [];
  lineChartOptions: ChartOptions = {
    responsive: true,
    responsiveAnimationDuration: 1000,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'COVID Infections'
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0
        }
      }]
    }
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black'
    },
  ];
  lineChartLegend = false;
  lineChartType: ChartType = 'line';
  lineChartPlugins = [];
  startDate?: Date;
  endDate?: Date;
  dateFormat = 'MM-dd-yyyy';

  constructor(private datePipe: DatePipe, private covidStateService: CovidStateService) { }

  async ngOnInit(): Promise<void> {
    this.covidStateService.stateChanged.subscribe(state => {
      this.lineChartData[0].data = state.cases;
      this.lineChartLabels = state.dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? '');
    });
  }
}
