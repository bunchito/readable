import { combineReducers } from 'redux';
import CategoryReducer from './category';
import PostReducer from './post';
import CommentReducer from './comment';
import ServerIsAlive from './alive';

const rootReducer = combineReducers({
  categories: CategoryReducer,
  posts: PostReducer,
  comments: CommentReducer,
  serverDown: ServerIsAlive
});

export default rootReducer;
