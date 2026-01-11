import { Link } from 'react-router-dom';
import { useState } from 'react';
import './PostCard.css';

export default function PostCard({ post }){
    const { id, title, author, score, numComments, thumbnail, subreddit} = post;
    const [imageError, setImageError] = useState(false);

    const hasValidThumbnail = thumbnail && !['self', 'default', 'nsfw', '', 'image', 'spoiler'].includes(thumbnail) && thumbnail.startsWith('http') && !imageError;

    return (
        <Link to={`/post/${id}`} className="post-card">
            {hasValidThumbnail && (
                <img src={thumbnail} alt={title} className='post-card__thumbnail' onError={() => setImageError(true)}/>
            )}

            <div className="post-card__content">
                <h3 className="post-card__title">{title}</h3>

                <div className="post-card__meta">
                    <span className='post-card__subreddit'>r/{subreddit}</span>
                    <span className='post-card__author'>by {author}</span>
                </div>

                <div className="post-card__stats">
                    <span className='post-card__score'>▲ {score}</span>
                    <span className='post-card__comments'>💬 {numComments}</span>
                </div>

            </div>
        </Link>
    )
}