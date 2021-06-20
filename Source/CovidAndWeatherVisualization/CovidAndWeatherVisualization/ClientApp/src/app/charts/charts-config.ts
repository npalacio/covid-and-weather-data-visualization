export const chartConfigs = {
  covid: {
    data: {
      data: [],
      fill: false,
      pointRadius: 0,
      pointHitRadius: 5
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'COVID Infections'
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
            labelString: 'Confirmed Infections',
            fontSize: 16,
            fontStyle: 'bold'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontSize: 18
          }
        }]
      }
    },
    colors: [
      {
        borderColor: 'black'
      }
    ],
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
