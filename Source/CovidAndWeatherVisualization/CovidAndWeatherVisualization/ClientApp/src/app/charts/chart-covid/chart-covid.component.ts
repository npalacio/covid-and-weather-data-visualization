import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CovidStateService } from 'src/app/state';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chart-covid',
  templateUrl: './chart-covid.component.html',
  styleUrls: ['./chart-covid.component.scss']
})
export class ChartCovidComponent implements OnInit {
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
  isLoading = false;

  constructor(private datePipe: DatePipe, private covidStateService: CovidStateService, private spinner: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {
    this.covidStateService.stateChanged.subscribe(state => {
      this.isLoading = state.isLoading;
      if (this.isLoading) {
        this.spinner.show();
      } else {
        this.lineChartData[0].data = state.cases;
        this.lineChartLabels = state.dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? '');
        this.spinner.hide();
      }
    });
  }
}
