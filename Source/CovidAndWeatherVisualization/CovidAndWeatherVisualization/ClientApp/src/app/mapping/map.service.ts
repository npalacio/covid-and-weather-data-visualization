import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import Map from '@arcgis/core/Map';
import { MapStateService } from '../state';
import { County } from '../shared/models/state/county.model';
import { MapState } from '../shared/models/state';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer: FeatureLayer = {} as any;
  private countyLayerView?: FeatureLayerView;
  private highlightedCounty?: __esri.Handle;

  constructor(private mapStateService: MapStateService) {
    this.mapStateService.stateChanged.subscribe(async (mapState: MapState) => {
      if(mapState.selectedCounty) {
        // In the end we want to be zooming somewhere here
        // We only want to zoom when they select a county
        var countyGraphic = await this.getCountyGraphic(mapState.selectedCounty.objectId);
        if(this.highlightedCounty) {
          this.highlightedCounty.remove();
        }
        this.highlightedCounty = this.countyLayerView?.highlight(mapState.selectedCounty.objectId);
        this.mapView?.goTo({
          target: countyGraphic,
          zoom: 8
        });
      }
    });
   }


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
    this.mapView.whenLayerView(this.countyLayer).then((layerView: FeatureLayerView) => {
      this.countyLayerView = layerView;
    });
  }

  async queryCounties(searchTerm: string, recordCount: number): Promise<void> {
    const query = {
      where: `STATE_NAME LIKE \'${searchTerm}%\' OR NAME LIKE\'${searchTerm}%\'`,
      returnGeometry: true,
      outFields: ['FID', 'NAME', 'STATE_NAME'],
      num: recordCount
    };

    const counties: County[] = await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features.map((feature): County => {
        return {
          objectId: feature.attributes.FID,
          name: feature.attributes.NAME,
          state: feature.attributes.STATE_NAME
        };
      });
    });

    // Push new search results onto state
    this.mapStateService.setCountySearchResults(counties);
  }

  private async getCountyGraphic(objectId: number): Promise<__esri.Graphic> {
    const query = {
      where: `FID = ${objectId}`,
      returnGeometry: true,
      outFields: ['FID']
    };

    return await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features[0]
    });
  }

}
