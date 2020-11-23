import { Action } from '@ngrx/store';

import { IPageData } from '../../interfaces/page-data';

export const SET = '[PageData] Set';
export const UPDATE = '[PageData] Update';
export const RESET = '[PageData] Reset';

export class Set implements Action {
  readonly type = SET;

  constructor(public data: IPageData) {}
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public data: any) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export type All = Set | Update | Reset;
