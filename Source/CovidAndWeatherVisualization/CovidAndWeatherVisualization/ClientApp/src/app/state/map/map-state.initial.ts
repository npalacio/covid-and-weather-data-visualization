import { MapState } from '../../shared/models/state/map-state.model';

export const initialMapState: MapState = {
  mapConfig: {
    basemap: 'arcgis-streets',
    center: [-98.5795, 39.8283], // Longitude, latitude
    zoom: 4,
    layerConfigs: [{
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer',
      layerId: 0,
      outFields: ['NAME', 'STATE_NAME'],
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
          color: [ 51, 51, 204, 0.9 ],
          style: 'solid',
          outline: {  // autocasts as new SimpleLineSymbol()
            color: 'white',
            width: 1
          }
        }
      } as any,
      popupTemplate: {
        title: '{NAME} County, {STATE_NAME}',
      }
    }],
  }
};
