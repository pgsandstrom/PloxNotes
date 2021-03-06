import update from 'immutability-helper';

import {
  SET_ID,
  ADD,
  REMOVE,
  SWITCH_CHECK,
  SET_FOCUS,
  MOVE_NOTE,
  EDIT_NOTE,
  SET_NOTES,
  SAVE_NOTE,
  SET_ERROR,
  UNDO,
} from './constants';
import { pending, rejected, fulfilled } from './errorHandlerMiddleware';

// when do we have 'window' but 'window.initNotes' is undefined? That happens when we navigate to the note page from a page that didnt prefetch data.
const initialState = {
  id: '',
  notes: typeof window !== 'undefined' && window.initNotes !== undefined ? window.initNotes : [],
  history: [],
  focusIndex: -1,
  ongoingSaves: 0,
  saved: false,
  error: '',
  notesLoaded: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ID:
      return { ...state, id: action.payload.id };
    case ADD:
      return update(
        { ...state, focusIndex: action.payload.index },
        {
          notes: { $splice: [[action.payload.index, 0, action.payload.note]] },
          history: { $push: [state.notes] },
        },
      );
    case REMOVE:
      return update(state, {
        notes: { $splice: [[action.payload.index, 1]] },
        history: { $push: [state.notes] },
      });
    case SWITCH_CHECK: {
      const currentChecked = state.notes[action.payload.index].checked;
      return update(state, {
        notes: {
          [action.payload.index]: { checked: { $set: !currentChecked } },
        },
        history: { $push: [state.notes] },
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
        history: { $push: [state.notes] },
      });
    }
    case EDIT_NOTE:
      return update(state, {
        notes: {
          [action.payload.index]: { text: { $set: action.payload.text } },
        },
        history: { $push: [state.notes] },
      });
    case SET_NOTES:
      return { ...state, notes: action.payload.data, notesLoaded: true };
    case pending(SAVE_NOTE):
      return { ...state, ongoingSaves: state.ongoingSaves + 1, saved: false };
    case fulfilled(SAVE_NOTE):
      return { ...state, ongoingSaves: state.ongoingSaves - 1, saved: true };
    case rejected(SAVE_NOTE):
      return { ...state, ongoingSaves: state.ongoingSaves - 1, saved: false };
    case SET_ERROR:
      return { ...state, error: action.payload.text };
    case UNDO:
      return { ...state, notes: state.history[state.history.length - 1], history: state.history.slice(0, -1) };
    default:
      return state;
  }
};
