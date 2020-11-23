import * as PatientsActions from '../actions/patients.actions';
import { IPatient } from '../../interfaces/patient';

export type Action = PatientsActions.All;

// Reducer function
export function patientsReducer(data: IPatient[] = [], action: Action) {
  switch (action.type) {
    case PatientsActions.SET: {
      return action.data;
    }
    case PatientsActions.EDIT: {
      data.forEach((patient: IPatient, index) => {
        if (patient.id === action.data.id) {
          data[index] = action.data;
        }
      });

      return [...data];
    }
    case PatientsActions.ADD: {
      return [action.data, ...data];
    }
    case PatientsActions.DELETE: {
      const newData = data.filter((patient: IPatient) => {
        return patient.id !== action.id;
      });

      console.log(newData)
      return newData;
    }
    case PatientsActions.OPEN_MODAL: {
      return true;
    }
    case PatientsActions.CLOSE_MODAL: {
      return false;
    }
    default: {
      return data;
    }
  }
}
