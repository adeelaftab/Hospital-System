import * as SettingsActions from '../actions/app-settings.actions';
import { IAppSettings } from '../../interfaces/settings';
import { environment } from '../../../environments/environment';

export type Action = SettingsActions.All;

// Default app state
const defaultSettings: IAppSettings = environment.appSettings;

// Helper function to create new state object
const newState = (state, newData) => {
  return Object.assign({}, state, newData);
}

// Reducer function
export function appSettingsReducer(state: IAppSettings = defaultSettings, action: Action) {
  // console.log(action.data, state);

  switch (action.type) {
    case SettingsActions.SET: {
      return action.data;
    }
    case SettingsActions.UPDATE: {
      return newState(state, action.data);
    }
    case SettingsActions.RESET: {
      return state = defaultSettings;
    }
    case SettingsActions.SIDEBAR_STATE: {
      state.sidebarOpened = action.data;

      return state;
    }
    default: {
      return state;
    }
  }
}
