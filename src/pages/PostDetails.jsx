import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, clearComments } from '../features/comments/commentsSlice';
import { clearPostDetail, fetchPostById } from '../features/posts/postsSlice';
import CommentsList from '../features/comments/CommentsList';
import ErrorState from '../features/ui/ErrorState';
import Loader from '../components/Loader';
import '../styles/PostDetails.css';

const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);

const isDirectImageUrl = (post) => isHttpUrl(post.url) && (
    post.postHint === 'image' ||
    /\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i.test(post.url)
);

const getRedditUrl = (permalink) => {
    if(!permalink) return null;
    if(isHttpUrl(permalink)) return permalink;

    const normalizedPermalink = permalink.startsWith('/') ? permalink : `/${permalink}`;
    return `https://www.reddit.com${normalizedPermalink}`;
};

export default function PostDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [failedImageKey, setFailedImageKey] = useState(null);
    const { items, detail } = useSelector((state) => state.posts);

    const listPost = items.find((item) => item.id === id);
    const detailPost = detail.requestedId === id ? detail.item : null;
    const post = listPost || detailPost;
    const postId = post?.id;
    const postSubreddit = post?.subreddit;

    useEffect(() => {
        if(!listPost && detail.requestedId !== id) {
            dispatch(fetchPostById(id));
        }
    }, [id, listPost, detail.requestedId, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearPostDetail());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if(postId && postSubreddit) {
            dispatch(fetchComments({
                subreddit: postSubreddit,
                postId,
            }));
        }

        return () => {
            dispatch(clearComments());
        };
    }, [postId, postSubreddit, dispatch]);

    const detailFailed = !post &&
        detail.requestedId === id &&
        detail.status === 'failed';

    if(detailFailed) {
        return (
            <div className='page'>
                <Link to="/" className="back-link">Back to Home</Link>
                <ErrorState
                    error={detail.error}
                    title="Failed to load post"
                    onRetry={() => dispatch(fetchPostById(id))}
                />
            </div>
        );
    }

    if(!post) {
        return (
            <div className='page'>
                <Link to="/" className="back-link">Back to Home</Link>
                <Loader message="Loading post..." />
            </div>
        );
    }

    const hasSelfText = Boolean(post.selfText?.trim());
    const directImagePost = isDirectImageUrl(post);
    const imageKey = `${post.id}:${post.url}`;
    const imageError = failedImageKey === imageKey;
    const showDirectImage = directImagePost && !imageError;
    const hasOutboundLink = !post.isSelf &&
        isHttpUrl(post.url) &&
        (!directImagePost || imageError);
    const redditUrl = getRedditUrl(post.permalink);
    const hasPrimaryContent = hasSelfText || showDirectImage || hasOutboundLink;

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

                {hasSelfText && (
                    <div className="post-detail__self-text">
                        <p>{post.selfText}</p>
                    </div>
                )}

                {showDirectImage && (
                    <img
                        src={post.url}
                        alt={post.title}
                        className='post-detail__image'
                        onError={() => setFailedImageKey(imageKey)}
                        loading='lazy'
                    />
                )}

                {!hasPrimaryContent && (
                    <div className='post-detail__placeholder'>
                        <div className="post-detail__placeholder-icon">🖼️</div>
                        <p className="post-detail__placeholder-text">
                            {post.isSelf ? 'This text post has no body.' : 'No supported preview available.'}
                        </p>
                    </div>
                )}

                {(hasOutboundLink || redditUrl) && (
                    <div className="post-detail__actions">
                        {hasOutboundLink && (
                            <a
                                href={post.url}
                                className="post-detail__link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open linked content
                            </a>
                        )}

                        {redditUrl && (
                            <a
                                href={redditUrl}
                                className="post-detail__link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                View on Reddit
                            </a>
                        )}
                    </div>
                )}
            </article>

            <CommentsList />
        </div>
    );
}
