import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/Layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import config from '@arcgis/core/config';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild("map", { static: true })
  private mapViewEl?: ElementRef;

  private mapView?: MapView;

  constructor() { }

  ngOnInit(): void {
    config.apiKey = 'AAPK731e0b4f7bf541ec9a2e542735af6990fUotVKYCQgH1Jssz-aMZSQ5pWUQuk3E4HBw4Zy9YVMVMhvEReKg1nLvtRyzRroPw';
    config.assetsPath = './assets';
    let symbol = {
      type: "simple-fill",  // autocasts as new SimpleFillSymbol()
      color: [ 51,51, 204, 0.9 ],
      style: "solid",
      outline: {  // autocasts as new SimpleLineSymbol()
        color: "white",
        width: 1
      }
    };
    const renderer = <any>{
      type: "simple",
      symbol: symbol
    };
    const countyLayer = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer",
      layerId: 0
    });
    countyLayer.renderer = renderer;
    const map = new Map({
      basemap: 'arcgis-streets', // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
      layers: [countyLayer]
    });
    this.mapView = new MapView({
      map: map,
      center: [-98.5795, 39.8283], // Longitude, latitude
      zoom: 4,
      container: this.mapViewEl?.nativeElement
    });
  }

}
