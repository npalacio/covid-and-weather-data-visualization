import { Component, OnInit } from '@angular/core';
import { from, Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { County } from 'src/app/shared/models/state';
import { MapService } from '../map.service';
import { MapStateService } from '../../state/map-state.service';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public model: any;
  private TYPEAHEAD_MIN_CHARS = 4;
  private TYPEAHEAD_MAX_SUGGESTION_COUNT = 20;

  constructor(private mapStateService: MapStateService, private mapService: MapService) { }

  ngOnInit(): void {
  }

  search: OperatorFunction<string, readonly County[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < this.TYPEAHEAD_MIN_CHARS) {
          return of([]);
        }
        return from(this.mapService.queryCounties(term, this.TYPEAHEAD_MAX_SUGGESTION_COUNT)).pipe(
          map(() => {
            return this.mapStateService.getCountySearchResults().sort((c1, c2) => {
              const countyNameCompare = c1.name.localeCompare(c2.name);
              return countyNameCompare !== 0 ? countyNameCompare : c1.state.localeCompare(c2.state);
            });
          }));
      })
    );
  }

  formatter = (county: County) => `${county.name}, ${county.state}`;

  onItemSelected(event: NgbTypeaheadSelectItemEvent<County>): void {
    this.mapStateService.setSelectedCounty(event.item);
  }
}

