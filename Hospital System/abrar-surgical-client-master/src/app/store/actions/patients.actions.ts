import { Action } from '@ngrx/store';
import { IPatient } from '../../interfaces/patient';

export const SET = '[Patients] Set';
export const ADD = '[Patients] Add';
export const EDIT = '[Patients] Edit';
export const DELETE = '[Patients] Delete';
export const OPEN_MODAL = '[Patients] Open modal';
export const CLOSE_MODAL = '[Patients] Close modal';

export class Set implements Action {
  readonly type = SET;

  constructor(public data: IPatient[]) {}
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public data: IPatient) {}
}

export class Edit implements Action {
  readonly type = EDIT;

  constructor(public data: IPatient) {}
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public id: string) {}
}

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export type All = Set | Add | Edit | Delete | OpenModal | CloseModal;
