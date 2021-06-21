export interface County {
  objectId: number;
  name: string;
  state: string;
  fips: number;
  population: number;
  center?: {latitdue: number, longitude: number};
}
