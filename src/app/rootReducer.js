import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import uiReducer from '../features/ui/uiSlice';
import themeReducer from '../features/ThemeToggle/themeSlice';


const rootReducer = {
    posts: postsReducer,
    comments: commentsReducer,
    ui: uiReducer,
    theme: themeReducer,
}

export default rootReducer;