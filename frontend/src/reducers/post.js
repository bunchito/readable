import { RECEIVE_POSTS_ALL, ADD_POST, EDIT_POST, DELETE_POST, SCORE_UP_POST, SCORE_DOWN_POST } from '../actions/types';


export default function(state = [], action) {

  if (action.error !== true) {
    switch (action.type) {
      case RECEIVE_POSTS_ALL:
      return action.payload.data;

      case ADD_POST:
      return [...state, action.payload.data];

      case EDIT_POST:
      return state.map(element => {
        if (element.id === action.payload.data.id) {
          return {
            ...element,
            title: action.payload.data.title,
            body: action.payload.data.body,
            timestamp: action.payload.data.timestamp
          }
        }
        return element
      });

      case DELETE_POST:
      console.log('delete post')
      return state.map(element => {
        if (element.id === action.payload.data.id) {
          return {
            ...element,
            deleted: action.payload.data.deleted
          }
        }
        return element;
        //  }).filter(element => element.deleted !== true);
      });

      case SCORE_UP_POST:
      return state.map(element => {
        if (element.id === action.payload.data.id) {
          return {
            ...element,
            voteScore: action.payload.data.voteScore
          }
        }
        return element
      });

      case SCORE_DOWN_POST:
      return state.map(element => {
        if (element.id === action.payload.data.id) {
          return {
            ...element,
            voteScore: action.payload.data.voteScore
          }
        }
        return element
      });


      default:
      return state;
    }

  }
}
