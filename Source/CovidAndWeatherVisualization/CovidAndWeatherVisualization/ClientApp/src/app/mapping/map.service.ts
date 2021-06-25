import { ElementRef, Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView';
import Map from '@arcgis/core/Map';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import { mapConfig } from './map-config';
import { County } from '../shared/models/county.model';
import { Router } from '@angular/router';
import { CountyStateService } from 'src/app/state';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapView?: MapView;
  private countyLayer: FeatureLayer = {} as any;
  private countyLayerView?: FeatureLayerView;
  private highlightedCounty?: __esri.Handle;
  private countyLayerObjectIdField = 'FID';
  private countyLayerOutFields = [this.countyLayerObjectIdField, 'FIPS', 'NAME', 'STATE_NAME', 'POPULATION'];

  constructor(private router: Router, private countyStateService: CountyStateService) {
  }

  async selectCounty(countyFips: number): Promise<void> {
    const countyGraphic = await this.getCountyGraphic(countyFips);
    if (countyGraphic) {
      const countyModel = this.getCountyModelFromGraphic(countyGraphic);
      this.highlightCounty(countyGraphic);
      this.showPopup(countyModel, countyGraphic.geometry);
      this.countyStateService.setSelectedCounty(countyModel);
    } else {
      // County not found, navigate to home page
      this.router.navigate(['counties']);
    }
  }

  private async highlightCounty(countyGraphic: __esri.Graphic): Promise<void> {
    if (this.highlightedCounty) {
      this.highlightedCounty.remove();
    }
    this.highlightedCounty = this.countyLayerView?.highlight(countyGraphic.attributes[this.countyLayerObjectIdField]);
  }

  private showPopup(countyModel: County, countyGeometry: __esri.Geometry): void {
    const countyCenter = (countyGeometry as __esri.Polygon).centroid;
    this.mapView?.popup.close();
    this.mapView?.popup.open({
      title: `${countyModel.name} County, ${countyModel.state}`,
      location: countyCenter,
      content: `<div>FIPS: ${countyModel.fips}</div>
      <div>Population: ${countyModel.population}</div>`
    });

  }

  async initializeMap(mapHtmlElement?: ElementRef): Promise<void> {
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
      await watchUtils.whenFalseOnce(this.countyLayerView, 'updating', () => { });
    });
    this.mapView.on('click', (event) => {
      this.mapView?.hitTest(event.screenPoint, {
        include: this.countyLayer
      }).then((response) => {
        if (response.results.length > 0) {
          const newCountyFips = +response.results[0].graphic.attributes.FIPS;
          this.router.navigate(['counties', newCountyFips], {queryParamsHandling: 'preserve'});
        }
      });
    });
  }

  async queryCountiesForSearch(searchTerm: string, recordCount: number): Promise<County[]> {
    const query = {
      where: `STATE_NAME LIKE \'${searchTerm}%\' OR NAME LIKE\'${searchTerm}%\'`,
      returnGeometry: true,
      outFields: this.countyLayerOutFields,
      num: recordCount
    };

    return this.countyLayer?.queryFeatures(query).then(result => {
      return result.features.map(this.getCountyModelFromGraphic);
    });
  }

  private async getCountyGraphic(countyFips: number): Promise<__esri.Graphic> {
    const query = {
      where: `FIPS = ${countyFips}`,
      returnGeometry: true,
      outFields: this.countyLayerOutFields
    };

    return await this.countyLayer?.queryFeatures(query).then(result => {
      return result.features[0];
    });
  }

  getCountyModelFromGraphic(countyGraphic: __esri.Graphic): County {
    const geometry = (countyGraphic.geometry as __esri.Polygon);
    return {
      objectId: countyGraphic.attributes.FID,
      name: countyGraphic.attributes.NAME,
      state: countyGraphic.attributes.STATE_NAME,
      fips: countyGraphic.attributes.FIPS,
      population: countyGraphic.attributes.POPULATION,
      center: {
        latitdue: geometry.centroid.latitude,
        longitude: geometry.centroid.longitude
      }
    };
}

}
