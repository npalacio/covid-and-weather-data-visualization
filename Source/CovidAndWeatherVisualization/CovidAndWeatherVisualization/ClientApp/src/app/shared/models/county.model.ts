export interface County {
  objectId: number;
  name: string;
  state: string;
  fips: number;
  population: number;
  populationPerSquareMile: number;
  center?: {latitdue: number, longitude: number};
}
