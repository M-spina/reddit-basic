import '../../styles/PostsSkeleton.css';

export default function PostsSkeleton({ count = 5 }) {
    return (
        <div className="posts-skeleton">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className='posts-skeleton__card'>
                    <div className='posts-skeleton__thumbnail skeleton-shimmer'></div>
                    <div className='posts-skeleton__content '>
                        <div className='posts-skeleton__title skeleton-shimmer'></div>
                        <div className='posts-skeleton__meta skeleton-shimmer'></div>
                        <div className='posts-skeleton__stats skeleton-shimmer'></div>
                    </div>
                </div>
            ))}
        </div>
    );
}