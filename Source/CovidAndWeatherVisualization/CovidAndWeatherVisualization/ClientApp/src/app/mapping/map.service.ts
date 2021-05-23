import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';
import { MapStateService } from '../state';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer?: FeatureLayer;

  constructor(private mapStateService: MapStateService) { }


  initializeMap(mapHtmlElement?: ElementRef): void {
    const mapState = this.mapStateService.get();
    const layers = mapState.layerConfigs.map((layerConfig) => {
      return new FeatureLayer({ ...layerConfig });
    });
    this.countyLayer = layers[0];
    const map = new Map({
      basemap: mapState.basemap, // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
      layers
    });
    this.mapView = new MapView({
      map,
      center: mapState.center,
      zoom: mapState.zoom,
      container: mapHtmlElement?.nativeElement
    });
    this.queryCounties('Nebraska');
  }

  queryCounties(searchTerm: string): Promise<FeatureSet> | undefined {
    const query = {
      where: `STATE_NAME = \'${searchTerm}\'`,
      returnGeometry: false,
      outFields: ['NAME', 'STATE_NAME']
    };

    return this.countyLayer?.queryFeatures(query);
  }

}
