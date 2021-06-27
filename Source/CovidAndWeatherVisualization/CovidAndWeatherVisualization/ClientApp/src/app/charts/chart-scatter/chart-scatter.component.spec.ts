import { ChartScatterComponent } from './chart-scatter.component';

describe('ChartScatterComponent', () => {
    let component: ChartScatterComponent;
    beforeEach(() => {
        component = new ChartScatterComponent({} as any, {} as any, {} as any);
    });
    describe('updateChartData', () => {
        it('with no covid data should set chart data to empty array', () => {
            component.weatherDataPointIndex = 'temperatureAverage';
            const result = component.getScatterChartData([], [{
                date: new Date(),
                temperatureAverage: 1
            }, {
                date: new Date(),
                temperatureAverage: 2
            }, {
                date: new Date(),
                temperatureAverage: 3
            }] as any[]);
            expect(result.chartData.length).toBe(0);
        });
        it('with no weather data should set chart data to empty array', () => {
            const result = component.getScatterChartData([{
                date: new Date(),
                casesNew: 1
            }, {
                date: new Date(),
                casesNew: 2
            }, {
                date: new Date(),
                casesNew: 3
            }] as any[], []);
            expect(result.chartData.length).toBe(0);
        });
        it('with covid and weather data should set chart data correctly', () => {
            const date1 = new Date('2021-01-01');
            const date2 = new Date('2021-01-02');
            const date3 = new Date('2021-01-03');
            component.weatherDataPointIndex = 'temperatureAverage';
            const result = component.getScatterChartData([{
                date: date1,
                casesNew: 1
            }, {
                date: date2,
                casesNew: 2
            }, {
                date: date3,
                casesNew: 3
            }] as any[], [{
                date: date1,
                temperatureAverage: 4
            }, {
                date: date2,
                temperatureAverage: 5
            }, {
                date: date3,
                temperatureAverage: 6
            }] as any[]);
            expect(result.chartData).toEqual([{
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
        it('with covid data missing for a date should leave that data point out', () => {
            const date1 = new Date('2021-01-01');
            const date2 = new Date('2021-01-02');
            const date3 = new Date('2021-01-03');
            component.weatherDataPointIndex = 'temperatureAverage';
            const result = component.getScatterChartData([{
                date: date2,
                casesNew: 2
            }, {
                date: date3,
                casesNew: 3
            }] as any[], [{
                date: date1,
                temperatureAverage: 4
            }, {
                date: date2,
                temperatureAverage: 5
            }, {
                date: date3,
                temperatureAverage: 6
            }] as any[]);
            expect(result.chartData).toEqual([{
                x: 5,
                y: 2
            }, {
                x: 6,
                y: 3
            }]);
        });
    });
});
