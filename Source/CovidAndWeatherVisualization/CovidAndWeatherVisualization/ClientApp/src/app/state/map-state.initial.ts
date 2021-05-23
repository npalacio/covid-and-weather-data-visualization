import { MapState } from '../shared/models/state/map-state.model';

export const initialMapState: MapState = {
  basemap: 'arcgis-streets',
  center: [-98.5795, 39.8283], // Longitude, latitude
  zoom: 4,
  layerConfigs: [{
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer",
    layerId: 0,
    outFields: ['NAME','STATE_NAME'],
    renderer: <any>{
      type: "simple",
      symbol: {
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: [ 51,51, 204, 0.9 ],
        style: "solid",
        outline: {  // autocasts as new SimpleLineSymbol()
          color: "white",
          width: 1
        }
      }
    },
    popupTemplate: {
      // NAME and COUNTY are fields in the service containing the Census Tract (NAME) and county of the feature
      title: "{NAME}, {STATE_NAME}",
    }
  }]
}
