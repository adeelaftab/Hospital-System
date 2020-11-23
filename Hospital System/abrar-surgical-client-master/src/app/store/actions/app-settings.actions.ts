import { Action } from '@ngrx/store';

import { IAppSettings } from '../../interfaces/settings';

export const SET = '[Settings] Set';
export const UPDATE = '[Settings] Update';
export const RESET = '[Settings] Reset';
export const SIDEBAR_STATE = '[Settings] Sidebar state';

export class Set implements Action {
  readonly type = SET;

  constructor(public data: IAppSettings) {}
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public data: any) {}
}

export class Reset implements Action {
  readonly type = RESET;

  constructor() {}
}

export class SidebarState implements Action {
  readonly type = SIDEBAR_STATE;

  constructor(public data: boolean) {}
}

export type All = Set | Update | Reset | SidebarState;
