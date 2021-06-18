import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BASE_URL } from 'src/app/shared/models/constants.model';
import { CovidDataByCounty } from '../../shared/models/covid-data.model';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [], fill: false, pointRadius: 0, pointHitRadius: 2 }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
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
  public lineChartColors: Color[] = [
    {
      borderColor: 'black'
    },
  ];
  public lineChartLegend = false;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  async ngOnInit(): Promise<void> {
    const covidData = await this.httpClient.get<CovidDataByCounty[]>(BASE_URL + 'Covid?startDate=2021-03-01&endDate=2021-06-10&fips=31055').toPromise();
    const dates = covidData.map(_ => _.date);
    const cases = covidData.map(_ => _.cases);
    this.lineChartData[0].data = cases;
    this.lineChartLabels = dates.map(date => this.datePipe.transform(date, 'MM/dd') ?? '');
  }

}
