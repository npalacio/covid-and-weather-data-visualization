import { MapConfig } from '../shared/models';

export const mapConfig: MapConfig = {
    basemap: 'arcgis-streets',
    center: [-98.5795, 39.8283],
    zoom: 4,
    layerConfigs: [{
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties_Generalized/FeatureServer',
      layerId: 0,
      outFields: ['FIPS', 'POP_SQMI'], // These outfields only used for what you need from the click event
      renderer: {
        type: 'class-breaks',
        field: 'POP_SQMI',
        defaultSymbol: {
          type: 'simple-fill',
          color: 'black',
          style: 'backward-diagonal',
          outline: {
            width: 0.5,
            color: [50, 50, 50, 0.6]
          }
        },
        defaultLabel: 'no data', // legend label for features that don't match a class break
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: .99,
            symbol: {
              type: 'simple-fill',
              color: '#fffcd4',
              style: 'solid',
              outline: {
                width: .2,
                color: [128, 128, 128, 0.5]
              }
            },
            label: '0 - .99'
          },
          {
            minValue: 1,
            maxValue: 49.99,
            symbol: {
              type: 'simple-fill',
              color: '#b1cdc2',
              style: 'solid',
              outline: {
                width: 0.2,
                color: [128, 128, 128, 0.5]
              }
            },
            label: '1 - 49.99'
          },
          {
            minValue: 50,
            maxValue: 99.99,
            symbol: {
              type: 'simple-fill',
              color: '#38627a',
              style: 'solid',
              outline: {
                width: 0.2,
                color: [128, 128, 128, 0.5]
              }
            },
            label: '50 - 99.99'
          },
          {
            minValue: 100,
            maxValue: 999.99,
            symbol: {
              type: 'simple-fill',
              color: '#153E6F',
              style: 'solid',
              outline: {
                width: 0.2,
                color: [128, 128, 128, 0.5]
              }
            },
            label: '100 - 999.99'
          },
          {
            minValue: 1000,
            maxValue: 999999999,
            symbol: {
              type: 'simple-fill',
              color: '#0d2644',
              style: 'solid',
              outline: {
                width: 0.2,
                color: [128, 128, 128, 0.5]
              }
            },
            label: '1000+'
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
