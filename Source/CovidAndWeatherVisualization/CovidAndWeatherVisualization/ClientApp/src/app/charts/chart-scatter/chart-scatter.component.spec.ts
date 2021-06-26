import { ChartScatterComponent } from "./chart-scatter.component";

describe('ChartScatterComponent', () => {
    let component: ChartScatterComponent;
    beforeEach(() => {
        component = new ChartScatterComponent(<any>{}, <any>{}, <any>{}, <any>{});
    });
    describe('updateChartData', () => {
        it('with no covid data should set chart data to empty array', () => {
            component.covidDataCasesNew = [];
            component.weatherData = <any[]>[{
                date: new Date(),
                temperatureAverage: 1
            }, {
                date: new Date(),
                temperatureAverage: 2
            }, {
                date: new Date(),
                temperatureAverage: 3
            }];
            component.updateChartData();
            expect(component.chartConfig.data.data.length).toBe(0);
        });
        it('with no weather data should set chart data to empty array', () => {
            component.covidDataCasesNew = <any[]>[{
                date: new Date(),
                casesNew: 1
            }, {
                date: new Date(),
                casesNew: 2
            }, {
                date: new Date(),
                casesNew: 3
            }];
            component.weatherData = [];
            component.updateChartData();
            expect(component.chartConfig.data.data.length).toBe(0);
        });
        it('with covid and weather data should set chart data correctly', () => {
            const date1 = new Date("2021-01-01");
            const date2 = new Date("2021-01-02");
            const date3 = new Date("2021-01-03");
            component.covidDataCasesNew = <any[]>[{
                date: date1,
                casesNew: 1
            }, {
                date: date2,
                casesNew: 2
            }, {
                date: date3,
                casesNew: 3
            }];
            component.weatherData = <any[]>[{
                date: date1,
                temperatureAverage: 4
            }, {
                date: date2,
                temperatureAverage: 5
            }, {
                date: date3,
                temperatureAverage: 6
            }];
            component.updateChartData();
            expect(component.chartConfig.data.data).toEqual([{
                x: 4,
                y: 1
            }, {
                x: 5,
                y: 2
            }, {
                x: 6,
                y: 3
            }]);
        });
    });
});
