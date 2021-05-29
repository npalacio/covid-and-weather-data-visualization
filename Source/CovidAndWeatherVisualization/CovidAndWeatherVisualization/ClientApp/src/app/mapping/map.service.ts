import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import { MapStateService } from '../state';
import { County } from '../shared/models/state/county.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer: FeatureLayer = {} as any;

  constructor(private mapStateService: MapStateService) { }


  initializeMap(mapHtmlElement?: ElementRef): void {
    const mapConfig = this.mapStateService.getMapConfig();
    const layers = mapConfig.layerConfigs.map((layerConfig) => {
      return new FeatureLayer({ ...layerConfig });
    });
    // TODO: Probably better way to get county layer
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
    const query = {
      where: `STATE_NAME LIKE \'${searchTerm}%\' OR NAME LIKE\'${searchTerm}%\'`,
      returnGeometry: false,
      outFields: ['OBJECTID', 'NAME', 'STATE_NAME'],
      num: recordCount
    };

    const counties: County[] = await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features.map(feature => {
        return {
          objectId: feature.attributes.OBJECTID,
          name: feature.attributes.NAME,
          state: feature.attributes.STATE_NAME
        };
      });
    });

    // Push new search results onto state
    this.mapStateService.setCountySearchResults(counties);
  }

}
