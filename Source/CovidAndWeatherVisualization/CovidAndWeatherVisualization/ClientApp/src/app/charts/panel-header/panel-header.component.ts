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
  dateFormat = 'MM/dd/yyyy';
  dateFormatUrl = 'MM-dd-yyyy';
  startDate: Date = new Date(2020, 0, 1);
  endDate: Date = new Date(2021, 0, 1);
  selectedCounty?: County;

  constructor(private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private countyStateService: CountyStateService) { }

  ngOnInit(): void {
    this.countyStateService.stateChanged.subscribe((countyState: CountyState) => {
      this.selectedCounty = countyState.selectedCounty;
    });

    // Sync up date with URL
    const startDateParam = this.route.snapshot.queryParamMap.get('startDate') ?? '';
    var startDateFromUrl = new Date(startDateParam);
    if (!isNaN(startDateFromUrl.getTime())) {
      this.startDate = startDateFromUrl;
    }

    const endDateParam = this.route.snapshot.queryParamMap.get('endDate') ?? '';
    var endDateFromUrl = new Date(endDateParam);
    if (!isNaN(endDateFromUrl.getTime())) {
      this.endDate = endDateFromUrl;
    }
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(this.startDate, this.dateFormatUrl),
        endDate: this.datePipe.transform(this.endDate, this.dateFormatUrl)
      },
      queryParamsHandling: 'merge'
    });
  }

}
