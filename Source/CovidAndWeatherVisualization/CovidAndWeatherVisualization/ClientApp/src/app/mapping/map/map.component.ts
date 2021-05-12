import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

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
    const map = new Map({
      basemap: "arcgis-topographic" // Basemap layer service
    });
    this.mapView = new MapView({
      map: map,
      container: this.mapViewEl?.nativeElement
    });
  }

}
