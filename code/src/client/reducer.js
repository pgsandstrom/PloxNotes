import update from 'immutability-helper';

import {
  SET_ID,
  ADD,
  REMOVE,
  SWITCH_CHECK,
  SET_FOCUS,
  MOVE_NOTE,
  EDIT_NOTE,
  LOAD_NOTE,
  SET_NOTES,
  SAVE_NOTE,
  SET_ERROR,
} from './constants';
import { pending, rejected, fulfilled } from './errorHandlerMiddleware';

const initialState = {
  id: '',
  notes: [],
  focusIndex: -1,
  loading: true,
  ongoingSaves: 0,
  saved: false,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ID:
      return { ...state, id: action.payload.id };
    case ADD:
      return update(
        { ...state, focusIndex: action.payload.index },
        { notes: { $splice: [[action.payload.index, 0, action.payload.note]] } },
      );
    case REMOVE:
      return update(state, { notes: { $splice: [[action.payload.index, 1]] } });
    case SWITCH_CHECK: {
      const currentChecked = state.notes[action.payload.index].checked;
      return update(state, {
        notes: {
          [action.payload.index]: { checked: { $set: !currentChecked } },
        },
      });
    }
    case SET_FOCUS:
      return { ...state, focusIndex: action.payload.index };
    case MOVE_NOTE: {
      const note = state.notes[action.payload.fromIndex];
      const tempState = update(state, {
        notes: { $splice: [[action.payload.fromIndex, 1]] },
      });
      return update(tempState, {
        notes: { $splice: [[action.payload.toIndex, 0, note]] },
      });
    }
    case EDIT_NOTE:
      return update(state, {
        notes: {
          [action.payload.index]: { text: { $set: action.payload.text } },
        },
      });
    case pending(LOAD_NOTE):
      return { ...state, loading: true };
    case fulfilled(LOAD_NOTE):
      return { ...state, loading: false, notes: action.payload };
    case SET_NOTES:
      return { ...state, notes: action.payload.data, loading: false };
    case pending(SAVE_NOTE):
      return { ...state, ongoingSaves: state.ongoingSaves + 1, saved: false };
    case fulfilled(SAVE_NOTE):
      return { ...state, ongoingSaves: state.ongoingSaves - 1, saved: true };
    case rejected(SAVE_NOTE):
      return { ...state, ongoingSaves: state.ongoingSaves - 1, saved: false };
    case SET_ERROR:
      return { ...state, error: action.payload.text };
    default:
      return state;
  }
};
