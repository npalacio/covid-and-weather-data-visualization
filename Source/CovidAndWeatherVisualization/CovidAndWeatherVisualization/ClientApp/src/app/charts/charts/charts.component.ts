import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartSettingsComponent } from '../chart-settings/chart-settings.component';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor(private modalService: NgbModal) {
  }
  ngOnInit(): void {
  }
  openChartSettings(): void {
    this.modalService.open(ChartSettingsComponent);
  }
}
