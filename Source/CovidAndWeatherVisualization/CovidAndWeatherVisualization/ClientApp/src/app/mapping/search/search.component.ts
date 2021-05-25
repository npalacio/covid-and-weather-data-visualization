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

  constructor(private mapStateService: MapStateService, private mapService: MapService) { }

  ngOnInit(): void {
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    // TODO: Limit # of suggested results
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if(term.length < this.TYPEAHEAD_MIN_CHARS) {
          return of([]);
        }
        return from(this.mapService.queryCounties(term)).pipe(
          map(() => {
            // TODO: Update rest query to only return however many you need
            return this.mapStateService.getCountySearchResults().slice(0, 5).map((county: County) => {
              return `${county.name}, ${county.state}`
            });
          }));
      })
    );
  }
}

