import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import uiReducer from '../features/ui/uiSlice';


const rootReducer = {
    posts: postsReducer,
    comments: commentsReducer,
    ui: uiReducer,
}

export default rootReducer;