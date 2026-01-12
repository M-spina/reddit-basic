import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, clearComments } from '../features/comments/commentsSlice';
import CommentsList from '../features/comments/CommentsList';
import '../styles/PostDetails.css';

export default function PostDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [imageError, setImageError] = useState(false);

    // get the post details from the store
    const post = useSelector((state) => state.posts.items.find((post) => post.id === id));

    useEffect(() => {
        // Fetch comments for the post when component mounts
        if(post) {
            dispatch(fetchComments({ 
                subreddit: post.subreddit, 
                postId: post.id 
            }));
        }
        // Cleanup comments on unmount
        return () => {
            dispatch(clearComments());
        };
    }, [id, post, dispatch]); 

    if(!post) {
        return (
            <div className='page'>
                <Link to="/" className="back-link">Back to Home</Link>
                <div style={{textAlign: 'center', padding: '2rem'}}>
                    <h2>Post not found</h2>
                    <p>The post you are looking for does not exist.</p>
                </div>  
            </div>
        )
    }

    const hasValidThumbnail = post.thumbnail &&
        !['self', 'default', 'nsfw', 'image', 'spoiler'].includes(post.thumbnail) &&
        post.thumbnail.startsWith('http') &&
        !imageError;


    return (
        <div className='page'>
            <Link to="/" className="back-link">Back to Home</Link>
            
            <article className="post-detail">
                <h1 className='post-detail__title'>{post.title}</h1>

                <div className='post-detail__meta'>
                    <span className='post-detail__subreddit'>r/{post.subreddit}</span>
                    <span className='post-detail__author'>Posted by u/{post.author}</span>
                </div>

                <div className='post-detail__stats'>
                    <span>⬆ {post.score} upvotes</span>
                    <span>💬 {post.numComments} comments</span>
                </div>

                {hasValidThumbnail ? (
                    <img 
                        src={post.thumbnail} 
                        alt={post.title} 
                        className='post-detail__image'
                        onError={() => setImageError(true)}
                        loading='lazy'
                    />
                ) : (
                    <div className='post-detail__placeholder'>
                        <div className="post-detail__placeholder-icon">🖼️</div>
                        <p className="post-detail__placeholder-text">{post.thumbnail === 'self' ? 'Text post' : 'No valid thumbnail available'}</p>
                    </div>
                )}
            </article>

            <CommentsList />
        </div>
    )
}