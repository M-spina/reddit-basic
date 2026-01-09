import  { useParams, Link } from 'react-router-dom';

export default function PostDetails() {
    const { id } = useParams();
    return (
        <div className='page'>
            <Link to="/" className="back-link">Back to Home</Link>
            <h2>Post Details for Post ID: {id}</h2>
            <p>This is where the details for the post would be displayed.</p>
            <p>Comments will be displayed here.</p>
        </div>
    )
}