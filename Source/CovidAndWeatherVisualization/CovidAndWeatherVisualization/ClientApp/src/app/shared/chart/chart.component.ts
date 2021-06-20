import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = 'Loading...';
  @Input() data: ChartDataSets = {};
  @Input() labels: Label[] = [];
  @Input() options: ChartOptions = {};
  @Input() colors: Color[] = [];
  @Input() legend: boolean = false;
  @Input() type: ChartType = 'line';

  constructor() { }

  ngOnInit(): void {
  }

}
