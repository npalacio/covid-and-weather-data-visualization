import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BASE_URL } from 'src/app/shared/models/constants.model';
import { CovidDataByCounty } from '../../shared/models/covid-data.model';
import { ChartStateService } from 'src/app/state';
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

  constructor(private httpClient: HttpClient, private datePipe: DatePipe, private chartStateService: ChartStateService, private covidDataService: CovidDataService) { }

  async ngOnInit(): Promise<void> {
    this.chartStateService.stateChanged.subscribe(state => {
      this.startDate = state.startDate;
      this.endDate = state.endDate;
      if(this.startDate && this.endDate) {
        this.updateChart();
      }
    });
  }

  async updateChart(): Promise<void> {
    const covidData = await this.covidDataService.getCovidDataByCounty({
      fips: 31055,
      startDate: this.startDate,
      endDate: this.endDate
    });
    const dates = covidData.map(_ => _.date);
    const cases = covidData.map(_ => _.cases);
    this.lineChartData[0].data = cases;
    this.lineChartLabels = dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? '');
  }

}
