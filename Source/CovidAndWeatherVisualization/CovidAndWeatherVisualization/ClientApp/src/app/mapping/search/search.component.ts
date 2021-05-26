import { Component, OnInit } from '@angular/core';
import { from, Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { County } from 'src/app/shared/models/state';
import { MapService } from '../map.service';
import { MapStateService } from '../../state/map-state.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public model: any;
  private TYPEAHEAD_MIN_CHARS = 3;
  private TYPEAHEAD_SUGGESTION_COUNT = 10;

  constructor(private mapStateService: MapStateService, private mapService: MapService) { }

  ngOnInit(): void {
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if(term.length < this.TYPEAHEAD_MIN_CHARS) {
          return of([]);
        }
        return from(this.mapService.queryCounties(term, this.TYPEAHEAD_SUGGESTION_COUNT)).pipe(
          map(() => {
            return this.mapStateService.getCountySearchResults().map((county: County) => {
              return `${county.name}, ${county.state}`
            });
          }));
      })
    );
  }
}

