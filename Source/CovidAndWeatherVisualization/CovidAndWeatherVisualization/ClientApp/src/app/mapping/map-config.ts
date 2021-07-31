import { MapConfig } from '../shared/models';

export const mapConfig: MapConfig = {
    basemap: 'arcgis-streets',
    center: [-98.5795, 39.8283],
    zoom: 4,
    layerConfigs: [{
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer',
      layerId: 0,
      outFields: ['FIPS','POP_SQMI'], // These outfields only used for what you need from the click event
      renderer: {
        type: "class-breaks",
        field: "POP_SQMI",
        defaultSymbol: {
          type: "simple-fill",
          color: "black",
          style: "backward-diagonal",
          outline: {
            width: 0.5,
            color: [50, 50, 50, 0.6]
          }
        },
        defaultLabel: "no data", // legend label for features that don't match a class break
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: 9.99,
            symbol: {
              type: "simple-fill",
              color: "#fffcd4",
              style: "solid",
              outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
              }
            },
            label: "0"
          },
          {
            minValue: 10,
            maxValue: 99.99,
            symbol: {
              type: "simple-fill", 
              color: "#b1cdc2",
              style: "solid",
              outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
              }
            },
            label: "1"
          },
          {
            minValue: 100,
            maxValue: 999.99,
            symbol: {
              type: "simple-fill",
              color: "#38627a",
              style: "solid",
              outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
              }
            },
            label: "2"
          },
          {
            minValue: 1000,
            maxValue: 999999999999,
            symbol: {
              type: "simple-fill",
              color: "#0d2644",
              style: "solid",
              outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
              }
            },
            label: "3"
          }
        ]
      }
    },
    {
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer',
      layerId: 0,
      outFields: [], // These outfields only used for what you need from the click event
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: [ 51, 51, 204, 0 ],
          style: 'solid',
          outline: {
            color: 'black',
            width: 1
          }
        }
      }
    }]
  };
