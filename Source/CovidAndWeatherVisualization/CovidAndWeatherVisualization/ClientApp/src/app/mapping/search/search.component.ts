import { Component, OnInit } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { County } from 'src/app/shared/models/state';
import { MapService } from '../map.service';
import { MapStateService } from '../../state/map-state.service';
import { MapState } from '../../shared/models/state/map-state.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public model: any;

  constructor(private mapStateService: MapStateService, private mapService: MapService) { }

  ngOnInit(): void {
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length > 2),
      tap(async term => await this.mapService.queryCounties(term))
      //tap here, call to map service to send it new search term
      // switchMap(term =>
      //   this.mapService.queryCounties(term)
      //     .pipe(
      //       map((results: County[]) => {
      //         return results.map((county: County) => `${county.name}, ${county.state}`);
      //       }))
      //)
    );
    return this.mapStateService.stateChanged.pipe(
      map((state: MapState) => {
        return state.countySearchResults.map((county: County) => {
          return `${county.name}, ${county.state}`
        })
      }));
  }
}

