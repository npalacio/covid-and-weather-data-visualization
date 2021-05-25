import { Component, OnInit } from '@angular/core';
import { from, Observable, OperatorFunction } from 'rxjs';
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
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length > 2),
      switchMap(term => {
        return from(this.mapService.queryCounties(term)).pipe(
          map(() => {
            return this.mapStateService.getCountySearchResults().map((county: County) => {
              return `${county.name}, ${county.state}`
            });
          }));
      })
    );
  }
}

