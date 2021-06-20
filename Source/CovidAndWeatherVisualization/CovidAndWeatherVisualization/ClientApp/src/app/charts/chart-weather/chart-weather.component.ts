import { Component, OnInit } from '@angular/core';
import { WeatherStateService } from '../../state/weather/weather-state.service';

@Component({
  selector: 'app-chart-weather',
  templateUrl: './chart-weather.component.html',
  styleUrls: ['./chart-weather.component.scss']
})
export class ChartWeatherComponent implements OnInit {

  constructor(private weatherStateService: WeatherStateService) { }

  ngOnInit(): void {
  }

}
