import '../../styles/ErrorState.css';

export default function ErrorState({
    error,
    onRetry,
    title = '⚠️ Oops!',
    showHints = false
}) {
    const message = typeof error === 'string'
        ? error
        : error?.message || 'An unexpected error occurred.';
    const isRateLimited = message.toLowerCase().includes('rate limit');

    return (
        <div className="error-state">
            <h3 className='error-state__title'>{title}</h3>
            <p className='error-state__message'>{message}</p>

            {(isRateLimited || showHints) && (
                <div className='error-state__hints'>
                    <p><strong>What to do:</strong></p>
                    <ul>
                        <li>Wait 1-2 minutes for the rate limit to reset</li>
                        <li>Try again with the button below</li>
                        <li>Cached posts may still be displayed</li>
                    </ul>
                </div>
            )}

            {onRetry && (
                <button
                    onClick={onRetry}
                    className='error-state__button'
                >
                    {isRateLimited ? 'Retry After Wait' : 'Retry'}
                </button>
            )}
        </div>
    );
}
