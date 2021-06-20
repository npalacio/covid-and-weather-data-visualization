import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = 'Loading...';
  @Input() data: ChartDataSets = {};
  @Input() labels: Label[] = [];
  @Input() options: ChartOptions = {};
  @Input() colors: Color[] = [];
  @Input() legend: boolean = false;
  @Input() type: ChartType = 'line';

  constructor(private spinner: NgxSpinnerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isLoading) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

}
