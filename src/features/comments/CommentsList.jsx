import { useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import './CommentsList.css';

export default function CommentsList() {
    const { items, status, error } = useSelector((state) => state.comments);
    
    if (status === 'loading') {
        return <div className="comments-list__status">Loading comments...</div>;
    }

    if(status === 'failed') {
        return (
            <div className= "comments-list__error">
                <p>Error loading comments: {error}</p>
            </div>
        );
    }

    if(items.length === 0 && status === 'succeeded') {
        return <div className="comments-list__status">No comments available.</div>;
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