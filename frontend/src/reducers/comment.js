import { RECEIVE_COMMENTS, ADD_COMMENT, EDIT_COMMENT, DELETE_COMMENT } from '../actions/types';

export default function(state = [], action) {

  if (action.error !== true) {
    switch (action.type) {
      case RECEIVE_COMMENTS:
      return action.payload.data;

      case ADD_COMMENT:
      return [...state, action.payload.data];

      case EDIT_COMMENT:
      return state.map(element => {
        if (element.id === action.payload.data.id) {
          return {
            ...element,
            body: action.payload.data.body,
            timestamp: action.payload.data.timestamp
          }
        }
        return element
      });

      case DELETE_COMMENT:
      return state.map(element => {
        if (element.id === action.payload.data.id) {
          return {
            ...element,
            deleted: action.payload.data.deleted
          }
        }
        return element
      }).filter(element => element.deleted !== true);

      default:
      return state;
    }

  }
}
