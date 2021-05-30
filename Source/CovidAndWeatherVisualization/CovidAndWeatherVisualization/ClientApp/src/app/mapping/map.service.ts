import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import Map from '@arcgis/core/Map';
import { CountyStateService, MapStateService } from '../state';
import { County } from '../shared/models/state/county.model';
import { CountyState } from '../shared/models/state';
import { StateWithPropertyChanges } from '@codewithdan/observable-store';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer: FeatureLayer = {} as any;
  private countyLayerView?: FeatureLayerView;
  private highlightedCounty?: __esri.Handle;
  private countyLayerObjectIdField = 'FID';

  constructor(private mapStateService: MapStateService, private countyStateService: CountyStateService) {
    this.countyStateService.stateWithPropertyChanges.subscribe(async (stateWithChanges: StateWithPropertyChanges<CountyState>) => {
      if(stateWithChanges.state.selectedCountyFips && stateWithChanges.stateChanges.selectedCountyFips) {
        // In the end we want to be zooming somewhere here
        // We only want to zoom when they select a county
        var countyGraphic = await this.getCountyGraphic(stateWithChanges.state.selectedCountyFips);
        if(this.highlightedCounty) {
          this.highlightedCounty.remove();
        }
        this.highlightedCounty = this.countyLayerView?.highlight(countyGraphic.attributes[this.countyLayerObjectIdField]);
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
      outFields: [this.countyLayerObjectIdField, 'NAME', 'STATE_NAME','FIPS'],
      num: recordCount
    };

    const counties: County[] = await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features.map((feature): County => {
        return {
          objectId: feature.attributes.FID,
          name: feature.attributes.NAME,
          state: feature.attributes.STATE_NAME,
          fips: feature.attributes.FIPS
        };
      });
    });

    // Push new search results onto state
    this.countyStateService.setCountySearchResults(counties);
  }

  private async getCountyGraphic(countyFips: number): Promise<__esri.Graphic> {
    const query = {
      where: `FIPS = ${countyFips}`,
      returnGeometry: true,
      outFields: [this.countyLayerObjectIdField, 'FIPS']
    };

    return await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features[0]
    });
  }

}
