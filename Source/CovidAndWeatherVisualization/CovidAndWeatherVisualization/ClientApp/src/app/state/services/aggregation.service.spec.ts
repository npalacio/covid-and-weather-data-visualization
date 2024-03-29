import { AggregationService } from './aggregation.service';

describe('AggregationService', () => {
  const service = new AggregationService();
  describe('getWeeklyAverages', () => {
    describe('with no weeks of data', () => {
      it('should return empty', () => {
        const input = new Array(6).fill({ date: null, value: null });
        const output = service.getWeeklyAverages(input);
        expect(output.length).toBe(0);
      });
    });
    describe('with 1 week of data', () => {
      it('should return 1 data point', () => {
        const input = new Array(7).fill({ date: null, value: null });
        const output = service.getWeeklyAverages(input);
        expect(output.length).toBe(1);
      });
      it('should return aggregated value', () => {
        const input = new Array(7).fill({ date: null, value: 3 });
        const output = service.getWeeklyAverages(input);
        expect(output[0].value).toBe(3);
      });
    });
    describe('with multiple weeks of data', () => {
      it('should return data point for every week', () => {
        for (let numberOfWeeks = 2; numberOfWeeks < 12; numberOfWeeks++) {
          const input = new Array(7 * numberOfWeeks).fill({ date: null, value: null });
          const output = service.getWeeklyAverages(input);
          expect(output.length).toBe(numberOfWeeks);
        }
      });
      it('should return aggregatedValue for every week', () => {
        for (let numberOfWeeks = 2; numberOfWeeks < 12; numberOfWeeks++) {
          let input: any[] = [];
          const expectedAverages = [];
          // for each week, build array with predictable average
          for (let i = 0; i < numberOfWeeks; i++) {
            const randomNum = Math.floor(Math.random() * 10000);
            const randomOffset = Math.floor(Math.random() * 10000);
            const dataForWeek = [randomNum - randomOffset
              , randomNum - randomOffset
              , randomNum - randomOffset
              , randomNum
              , randomNum + randomOffset
              , randomNum + randomOffset
              , randomNum + randomOffset].map(value => ({ date: null, value }));
            input = input.concat(dataForWeek);
            expectedAverages.push(randomNum);
          }
          const output = service.getWeeklyAverages(input);
          for (let i = 0; i < numberOfWeeks; i++) {
            expect(output[i].value).toBe(expectedAverages[i]);
          }
        }
      });
    });
  });
  describe('get7DayRollingAverages', () => {
    describe('with no weeks of data', () => {
      it('should return empty', () => {
        const input = new Array(6).fill({ date: null, value: null });
        const output = service.get7DayRollingAverages(input);
        expect(output.length).toBe(0);
      });
    });
    describe('with 1 week of data', () => {
      it('should return 1 data point', () => {
        const input = new Array(7).fill({ date: null, value: null });
        const output = service.get7DayRollingAverages(input);
        expect(output.length).toBe(1);
      });
      it('should return aggregated value', () => {
        const input = new Array(7).fill({ date: null, value: 3 });
        const output = service.get7DayRollingAverages(input);
        expect(output[0].value).toBe(3);
      });
    });
    describe('with over 1 week of data', () => {
      it('should return data point for every day after a week', () => {
        for (let numberOfWeeks = 2; numberOfWeeks < 12; numberOfWeeks++) {
          const input = new Array(7 * numberOfWeeks).fill({ date: null, value: null });
          const output = service.get7DayRollingAverages(input);
          expect(output.length).toBe((numberOfWeeks - 1) * 7 + 1);
        }
      });
      it('should return aggregatedValue for every day after a week', () => {
        const input = new Array(7).fill({ date: null, value: 1 });
        input.push({date: null, value: 2});
        input.push({date: null, value: 3});
        console.log(input.length);
        const output = service.get7DayRollingAverages(input);
        console.log(output.length);
        expect(output[0].value).toBe(1);
        expect(output[1].value).toBe(1.1);
        expect(output[2].value).toBe(1.4);
      });
    });
  });
});
