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
  @ViewChild("map", { static: true })
  private mapViewEl?: ElementRef;

  private mapView?: MapView;

  constructor(private mapStateService: MapStateService) { }

  ngOnInit(): void {
    config.apiKey = 'AAPK731e0b4f7bf541ec9a2e542735af6990fUotVKYCQgH1Jssz-aMZSQ5pWUQuk3E4HBw4Zy9YVMVMhvEReKg1nLvtRyzRroPw';
    config.assetsPath = './assets';
    this.initializeMap();
  }

  initializeMap() {
    const mapState = this.mapStateService.get();
    const layers = mapState.layerConfigs.map((layerConfig) => {
      return new FeatureLayer({...layerConfig})
    });
    const map = new Map({
      basemap: mapState.basemap, // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
      layers: layers
    });
    this.mapView = new MapView({
      map: map,
      center: mapState.center,
      zoom: mapState.zoom,
      container: this.mapViewEl?.nativeElement
    });
    this.mapView.on("click", (evt) => {
      this?.mapView?.hitTest(evt).then((response) => {
        if (response.results.length) {
          console.log('feature hit:' + response)
        } else {
          console.log('no features hit')
        }
      });
    });
  }

}
