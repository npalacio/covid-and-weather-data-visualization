import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { MapState } from '../shared/models/state';

@Injectable({
  providedIn: 'root'
})
export class MapStateService extends ObservableStore<MapState> {

  constructor() {
    const initialState: MapState = {
      basemap: 'arcgis-streets',
      layers: [{
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer",
        layerId: 0,
        outFields: ['NAME','STATE_NAME'],
        renderer: <any>{
          type: "simple",
          symbol: {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [ 51,51, 204, 0.9 ],
            style: "solid",
            outline: {  // autocasts as new SimpleLineSymbol()
              color: "white",
              width: 1
            }
          }
        }
      }]
    };
    super({});
    this.setState(initialState, 'INIT_STATE');
  }

  get() {
    return this.getState();
  }
}
