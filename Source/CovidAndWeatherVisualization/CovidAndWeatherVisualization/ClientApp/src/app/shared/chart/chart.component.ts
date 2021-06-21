import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() isLoading = false;
  @Input() data: ChartDataSets = {};
  @Input() labels: Label[] = [];
  @Input() options: ChartOptions = {};
  @Input() colors: Color[] = [];
  @Input() legend = false;
  @Input() type: ChartType = 'line';

  constructor() { }

}
