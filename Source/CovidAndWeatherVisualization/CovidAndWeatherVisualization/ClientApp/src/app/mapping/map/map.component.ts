import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import config from '@arcgis/core/config';
import { MapStateService } from '../../state/map-state.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true })
  private mapViewEl?: ElementRef;

  private mapView?: MapView;
  private countyLayer?: FeatureLayer;

  constructor(private mapStateService: MapStateService) { }

  ngOnInit(): void {
    config.apiKey = 'AAPK731e0b4f7bf541ec9a2e542735af6990fUotVKYCQgH1Jssz-aMZSQ5pWUQuk3E4HBw4Zy9YVMVMhvEReKg1nLvtRyzRroPw';
    config.assetsPath = './assets';
    this.initializeMap();
  }

  initializeMap(): void {
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
      container: this.mapViewEl?.nativeElement
    });
    this.queryCounties();
  }

  queryCounties() {
    const query = {
      where: 'STATE_NAME = \'Nebraska\'',
      returnGeometry: false,
      outFields: ['NAME', 'STATE_NAME']
    };

    this.countyLayer?.queryFeatures(query).then(function(results){
      console.log(results.features);  // prints the array of features to the console
    });
  }

}
