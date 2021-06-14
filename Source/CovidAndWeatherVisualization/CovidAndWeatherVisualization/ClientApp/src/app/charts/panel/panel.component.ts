import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  isPanelVisible = false;
  areChartsVisible = false;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const fips = params.get('fips');
      if (fips) {
        this.isPanelVisible = true;
        this.areChartsVisible = true;
      }
    });
  }
  hideCharts() {
    this.areChartsVisible = false;
  }
  showCharts() {
    this.areChartsVisible = true;
  }
}
