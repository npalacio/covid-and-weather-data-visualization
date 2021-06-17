import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapService } from 'src/app/mapping/map.service';
import { County } from 'src/app/shared/models';
import { CountyStateService } from '../../state/county/county-state.service';
import { CountyState } from '../../state/county/county-state.model';

@Component({
  selector: 'app-panel-header',
  templateUrl: './panel-header.component.html',
  styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent implements OnInit {
  dateFormat = 'MM-dd-yyyy';
  startDate: Date = new Date(2020, 0, 1);
  selectedCounty?: County;

  constructor(private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private countyStateService: CountyStateService) { }

  ngOnInit(): void {
    // Sync up date with URL
    const startDateParam = this.route.snapshot.queryParamMap.get('startDate');
    if (startDateParam) {
      var startDateFromUrl = new Date(startDateParam);
      if (!isNaN(startDateFromUrl.getTime())) {
        this.startDate = startDateFromUrl;
      } else {
        this.setStartDateInUrl(this.startDate);
      }
    } else {
      this.setStartDateInUrl(this.startDate);
    }

    this.countyStateService.stateChanged.subscribe((countyState: CountyState) => {
      this.selectedCounty = countyState.selectedCounty;
    });
  }

  setStartDateInUrl(startDate: Date): void {
    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(startDate, this.dateFormat)
      },
      queryParamsHandling: 'merge'
    });
  }

}
