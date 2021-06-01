import { MapConfig } from '../shared/models';

export const mapConfig: MapConfig = {
    basemap: 'arcgis-streets',
    center: [-98.5795, 39.8283],
    zoom: 4,
    layerConfigs: [{
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer',
      layerId: 0,
      outFields: ['FIPS'], // These outfields only used for what you need from the click event
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: [ 51, 51, 204, 0.5 ],
          style: 'solid',
          outline: {
            color: 'white',
            width: 1
          }
        }
      }
    }]
  };
