import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import { MapStateService } from '../state';
import { from, Observable, of } from 'rxjs';
import { County } from '../shared/models/state';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer: FeatureLayer = <any>{};

  constructor(private mapStateService: MapStateService) { }


  initializeMap(mapHtmlElement?: ElementRef): void {
    const mapConfig = this.mapStateService.getMapConfig();
    const layers = mapConfig.layerConfigs.map((layerConfig) => {
      return new FeatureLayer({ ...layerConfig });
    });
    this.countyLayer = layers[0];
    const map = new Map({
      basemap: mapConfig.basemap, // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
      layers
    });
    this.mapView = new MapView({
      map,
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      container: mapHtmlElement?.nativeElement
    });
  }

  async queryCounties(searchTerm: string, recordCount: number): Promise<void> {
    //TODO: move into private method
    const query = {
      where: `STATE_NAME LIKE \'${searchTerm}%\' OR NAME LIKE\'${searchTerm}%\'`,
      returnGeometry: false,
      outFields: ['NAME', 'STATE_NAME'],
      num: recordCount
    };

    const counties = await this.countyLayer?.queryFeatures(query).then(result => {
      const counties = result.features.map(feature => {
        return {
          name: feature.attributes.NAME,
          state: feature.attributes.STATE_NAME
        }
      })
      return counties;
    });
    // Push new search results onto state
    this.mapStateService.setCountySearchResults(counties);
  }

}
