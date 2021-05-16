import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
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
    const map = new Map({
      basemap: 'arcgis-streets' // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
    });
    this.mapView = new MapView({
      map: map,
      center: [-98.5795, 39.8283], // Longitude, latitude
      zoom: 4,
      container: this.mapViewEl?.nativeElement
    });
  }

}
