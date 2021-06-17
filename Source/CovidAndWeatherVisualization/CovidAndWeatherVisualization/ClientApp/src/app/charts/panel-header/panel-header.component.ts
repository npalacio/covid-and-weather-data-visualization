import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-panel-header',
  templateUrl: './panel-header.component.html',
  styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent implements OnInit {
  urlDateFormat = 'MM-dd-yyyy';
  dateFormat = 'MM-dd-yyyy';
  startDate: Date = new Date(2020, 0, 1);

  constructor(private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const startDateParam = this.route.snapshot.queryParamMap.get('startDate');
    if (startDateParam) {
      var startDateFromUrl = new Date(startDateParam);
      if (!isNaN(startDateFromUrl.getTime())) {
        // Valid start date in URL
        this.startDate = startDateFromUrl;
      } else {
        this.setStartDateInUrl(this.startDate);
      }
    } else {
      this.setStartDateInUrl(this.startDate);
    }
  }

  setStartDateInUrl(startDate: Date): void {
    this.router.navigate([], {
      queryParams: {
        startDate: this.datePipe.transform(startDate, this.urlDateFormat)
      },
      queryParamsHandling: 'merge',
    });
  }

}
