import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import themeReducer from '../features/ThemeToggle/themeSlice';


const rootReducer = {
    posts: postsReducer,
    comments: commentsReducer,
    theme: themeReducer,
}

export default rootReducer;
