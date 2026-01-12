import './Comment.css'

export default function Comment({ comment }) {
    const { author, body, score, depth } = comment;

    // Indent based on depth
    const indentStyle = {
        marginLeft: `${depth * 20}px`,
    };

    return (
        <div className='comment' style={indentStyle}>
            <div className='comment__header'>
                <span className='comment__author'>u/{author}</span>
                <span className='comment__score'>⬆ {score}</span>
            </div>
            <p className='comment__body'>{body}</p>
        </div>
    )
}