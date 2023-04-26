import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IState, intial_state } from '../interfaces/state';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _state = new BehaviorSubject<IState>(intial_state);

  getState() {
    return this._state.asObservable();
  }

  setState(new_state: IState) {
    this._state.next(new_state); // set new state and notify subscribers
    return this._state.value;
  }

  isLoggedIn(): boolean {
    return this._state.value._id ? true : false;
  }
  getToken(): string {
    return this._state.value.jwt || '';
  }
}
