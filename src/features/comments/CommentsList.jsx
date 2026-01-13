import { useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import Loader from "../../components/Loader.jsx";
import ErrorState from "../ui/ErrorState.jsx";
import './CommentsList.css';

export default function CommentsList() {
    const { items, status, error } = useSelector((state) => state.comments);
    
    //show loader while loading
    if (status === 'loading') {
        return <Loader message="Loading comments..." />;
    }

    if(status === 'failed') {
        return (
           <ErrorState
               error={error}
               title="Failed to load comments"
               onRetry={null}
           />
        );
    }

    if(items.length === 0 && status === 'succeeded') {
        return <div className="comments-list__empty">No comments available.</div>;
    }

    if(status === 'idle') {
        return null; // Don't render anything until comments are fetched
    }

    return (
        <div className="comments-list">
            <h3 className="comments-list__title">Comments ({items.length})</h3>
            {items.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
            
    )
}