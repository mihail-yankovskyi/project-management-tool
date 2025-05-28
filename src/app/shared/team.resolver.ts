import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers/app-state.interface';
import { getTeamDetails } from '../reducers/team/team.actions';

@Injectable({ providedIn: 'root' })
export class TeamResolver implements Resolve<void> {
  constructor(private store: Store<IAppState>) {}

  resolve() {
    this.store.dispatch(getTeamDetails());
  }
}
