import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss']
})
export class AppContainerComponent implements OnInit {
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
