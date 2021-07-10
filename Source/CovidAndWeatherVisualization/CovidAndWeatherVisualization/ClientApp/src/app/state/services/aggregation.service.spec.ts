import { AggregationService } from "./aggregation.service";

describe('AggregationService', () => {
  const service = new AggregationService();
  describe('getWeeklyAverages', () => {
    describe('with 1 week worth of data', () => {
      it('should return 1 data point', () => {
        const input = new Array(7).fill({date: null, value: null});
        const output = service.getWeeklyAverages(input);
        expect(output.length).toBe(1);
      });
      it('should return aggregated value', () => {
        const input = new Array(7).fill({date: null, value: 3});
        const output = service.getWeeklyAverages(input);
        expect(output[0].value).toBe(3);
      });
    });
  });
});
