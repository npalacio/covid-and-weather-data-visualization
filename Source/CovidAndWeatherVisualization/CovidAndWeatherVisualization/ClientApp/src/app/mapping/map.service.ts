import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import Map from '@arcgis/core/Map';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import { CountyStateService, MapStateService } from '../state';
import { County } from '../shared/models/state/county.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer: FeatureLayer = {} as any;
  private countyLayerView?: FeatureLayerView;
  private highlightedCounty?: __esri.Handle;
  private countyLayerObjectIdField = 'FID';

  constructor(private mapStateService: MapStateService, private countyStateService: CountyStateService, private router: Router) {
  }

  async selectCounty(countyFips: number): Promise<void> {
    var countyGraphic = await this.getCountyGraphic(countyFips);
    if (countyGraphic) {
      this.zoomToCounty(countyGraphic);
      this.showPopup(countyGraphic);
    } else {
      this.router.navigate(['counties']);
    }
  }

  private async zoomToCounty(countyGraphic: __esri.Graphic): Promise<void> {
    if (this.highlightedCounty) {
      this.highlightedCounty.remove();
    }
    this.highlightedCounty = this.countyLayerView?.highlight(countyGraphic.attributes[this.countyLayerObjectIdField]);
    await this.mapView?.goTo({
      target: countyGraphic,
      zoom: 8
    }, {
      animate: true,
      duration: 800,
      easing: 'ease'
    });
  }

  private showPopup(countyGraphic: __esri.Graphic) {
    this.mapView?.popup.close();
    this.mapView?.popup.open({
      title: `${countyGraphic.attributes.NAME} County, ${countyGraphic.attributes.STATE_NAME}`,
      location: (countyGraphic.geometry as __esri.Polygon).centroid,
      content: `<div>FIPS: ${countyGraphic.attributes.FIPS}</div>
      <div>Population: ${countyGraphic.attributes.POPULATION}</div>`
    });

  }

  async initializeMap(mapHtmlElement?: ElementRef): Promise<void> {
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
    await this.mapView.whenLayerView(this.countyLayer).then(async (layerView: FeatureLayerView) => {
      this.countyLayerView = layerView;
      // Wait for layer to finish drawing before we zoom to selected county
      await watchUtils.whenFalseOnce(this.countyLayerView, "updating", () => { });
    });
    this.mapView.on("click", (event) => {
      this.mapView?.hitTest(event.screenPoint, {
        include: this.countyLayer
      }).then((response) => {
        if (response.results.length > 0) {
          var newCountyFips = +response.results[0].graphic.attributes.FIPS;
          this.router.navigate(['counties', newCountyFips]);
        }
      });
    });
  }

  async queryCountiesForSearch(searchTerm: string, recordCount: number): Promise<void> {
    const query = {
      where: `STATE_NAME LIKE \'${searchTerm}%\' OR NAME LIKE\'${searchTerm}%\'`,
      returnGeometry: true,
      outFields: [this.countyLayerObjectIdField, 'NAME', 'STATE_NAME', 'FIPS'],
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
      outFields: [this.countyLayerObjectIdField, 'FIPS', 'NAME', 'STATE_NAME', 'POPULATION']
    };

    return await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features[0]
    });
  }

}
