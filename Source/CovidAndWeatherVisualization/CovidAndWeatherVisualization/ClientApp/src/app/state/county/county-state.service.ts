import { Injectable } from "@angular/core";
import { ObservableStore } from "@codewithdan/observable-store";
import { County } from "src/app/shared/models";
import { CountyState } from "./county-state.model";

@Injectable({
  providedIn: 'root'
})
export class CountyStateService extends ObservableStore<CountyState> {

  constructor() {
    const initialState: CountyState = {
      selectedCounty: undefined
    }
    super({});
    this.setState(initialState, 'INIT_STATE');
  }

  setSelectedCounty(selectedCounty: County) {
    this.setState({ selectedCounty }, 'SET_SELECTED_COUNTY');
  }

}
