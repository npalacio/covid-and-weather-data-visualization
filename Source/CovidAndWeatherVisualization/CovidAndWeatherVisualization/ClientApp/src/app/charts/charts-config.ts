const axisLabelFontSize = 16;

const defaultData = {
  data: [],
  fill: false,
  pointRadius: 0,
  pointHitRadius: 5
};

const defaultColors = [
  {
    borderColor: 'black'
  }
];

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const defaultXAxisScaleLabel = {
  scaleLabel: {
    display: true,
    labelString: 'Date',
    fontSize: 18
  }
};

export const chartConfigs = {
  covid: {
    data: { ...defaultData },
    options: {
      ...defaultOptions,
      title: {
        display: true,
        text: 'Daily COVID Infections'
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            suggestedMin: 0,
            callback: (value: string | number, index: any, values: any) => tickFormatter(+value)
          },
          scaleLabel: {
            display: true,
            labelString: 'New Infections',
            fontSize: axisLabelFontSize,
            fontStyle: 'bold'
          }
        }],
        xAxes: [defaultXAxisScaleLabel]
      }
    },
    colors: defaultColors,
    legend: false,
    type: 'line'
  },
  scatter: {
    data: defaultData,
    options: {
      ...defaultOptions,
      title: {
        display: true,
        text: 'Covid Infections vs {WeatherDataPoint}'
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Covid Infections',
            fontSize: axisLabelFontSize,
            fontStyle: 'bold'
          }
        }],
        x: {
          type: 'linear',
          position: 'bottom'
        },
        xAxes: [{
          scaleLabel: {
            ...defaultXAxisScaleLabel.scaleLabel,
            labelString: ''
          }
        }]
      }
    },
    colors: defaultColors,
    legend: false,
    type: 'scatter'
  },
  temperature: {
    data: defaultData,
    options: {
      ...defaultOptions,
      title: {
        display: true,
        text: 'Daily Average Temperature'
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Average Temperature (F)',
            fontSize: axisLabelFontSize,
            fontStyle: 'bold'
          }
        }],
        xAxes: [defaultXAxisScaleLabel]
      }
    },
    colors: defaultColors,
    legend: false,
    type: 'line'
  },
  humidityRelative: {
    data: defaultData,
    options: {
      ...defaultOptions,
      title: {
        display: true,
        text: 'Daily Average Relative Humidity'
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Average Rel Hum (%)',
            fontSize: axisLabelFontSize,
            fontStyle: 'bold'
          }
        }],
        xAxes: [defaultXAxisScaleLabel]
      }
    },
    colors: defaultColors,
    legend: false,
    type: 'line'
  },
  humiditySpecific: {
    data: defaultData,
    options: {
      ...defaultOptions,
      title: {
        display: true,
        text: 'Daily Average Specific Humidity'
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Average Spec Hum (g/kg)',
            fontSize: axisLabelFontSize,
            fontStyle: 'bold'
          }
        }],
        xAxes: [defaultXAxisScaleLabel]
      }
    },
    colors: defaultColors,
    legend: false,
    type: 'line'
  }

};

function tickFormatter(value: number): number | string {
  if (value === 0) {
    return 0;
  }
  else {
    // hundreds
    if (value <= 999) {
      return value;
    }
    // thousands
    else if (value >= 1000 && value <= 999999) {
      return (value / 1000) + 'K';
    }
    // millions
    else if (value >= 1000000 && value <= 999999999) {
      return (value / 1000000) + 'M';
    }
    else {
      return value;
    }
  }
}
