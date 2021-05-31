import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import config from '@arcgis/core/config';
import { MapService } from '../map.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true })
  private mapViewEl?: ElementRef;

  constructor(private mapService: MapService, private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    config.apiKey = 'AAPK731e0b4f7bf541ec9a2e542735af6990fUotVKYCQgH1Jssz-aMZSQ5pWUQuk3E4HBw4Zy9YVMVMhvEReKg1nLvtRyzRroPw';
    config.assetsPath = '/assets';
    await this.mapService.initializeMap(this.mapViewEl);
    this.route.paramMap.subscribe(params => {
      const fips = params.get('fips');
      if (fips) {
        this.mapService.selectCounty(+fips);
      }
    });
  }

}
