import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-panel-header',
  templateUrl: './panel-header.component.html',
  styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent implements OnInit {
  dateFormat = 'MM/dd/yyyy';
  startDate: Date = new Date(2020, 0, 1);

  constructor(private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const startDateParam = params.get('startDate') ?? '';
      var startDate = new Date(startDateParam);
      if (startDateParam) {
        console.log('date from url: ' + startDateParam);
      }
    });
    // this.router.navigate([], {
    //   queryParams: {
    //     startDate: this.datePipe.transform(this.startDate, this.dateFormat)
    //   },
    //   queryParamsHandling: 'merge',
    // });
  }

}
