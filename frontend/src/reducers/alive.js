import { SERVER_ALIVE } from '../actions/types';

export default function(state = '', action) {
  switch (action.type) {
    case SERVER_ALIVE:
    return action.payload;

    default:
    return state;
  }
}
