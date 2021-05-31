import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, mergeMap } from 'rxjs/operators';
import { County } from 'src/app/shared/models';
import { MapService } from '../map.service';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchInput', { static: true })
  private searchInput?: ElementRef;
  public model: any;
  private TYPEAHEAD_MIN_CHARS = 4;
  private TYPEAHEAD_MAX_SUGGESTION_COUNT = 20;
  private currentSearchFips?: number;

  constructor(private mapService: MapService
            , private router: Router
            , private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const fips = params.get('fips');
      if (fips && +fips !== this.currentSearchFips && this.searchInput) {
        this.searchInput.nativeElement.value = '';
      }
    });
  }

  search: OperatorFunction<string, readonly County[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= this.TYPEAHEAD_MIN_CHARS),
      mergeMap(async (term) => {
        const countySearchResults = await this.mapService.queryCountiesForSearch(term, this.TYPEAHEAD_MAX_SUGGESTION_COUNT);
        return countySearchResults.sort((c1, c2) => {
          const countyNameCompare = c1.name.localeCompare(c2.name);
          return countyNameCompare !== 0 ? countyNameCompare : c1.state.localeCompare(c2.state);
        });
      })
    );
  }

  formatter = (county: County) => `${county.name}, ${county.state}`;

  onItemSelected(event: NgbTypeaheadSelectItemEvent<County>): void {
    this.currentSearchFips = event.item.fips;
    this.router.navigate(['counties', this.currentSearchFips]);
  }
}
