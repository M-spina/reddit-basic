import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ErrorState from './ErrorState.jsx';

describe('ErrorState', () => {
    it('renders a Redux string error and a generic retry action', async () => {
        const onRetry = vi.fn();
        const user = userEvent.setup();

        render(
            <ErrorState
                error="Subreddit not found"
                onRetry={onRetry}
            />,
        );

        expect(screen.getByText('Subreddit not found')).toBeInTheDocument();
        expect(screen.queryByText('What to do:')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Retry' }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it('detects a rate-limit string and renders tailored guidance', () => {
        render(
            <ErrorState
                error="Rate limit exceeded. Please wait and try again."
                onRetry={vi.fn()}
            />,
        );

        expect(screen.getByText('Rate limit exceeded. Please wait and try again.')).toBeInTheDocument();
        expect(screen.getByText('What to do:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Retry After Wait' })).toBeInTheDocument();
    });

    it('continues to accept Error objects defensively', () => {
        render(<ErrorState error={new Error('Object-shaped failure')} />);

        expect(screen.getByText('Object-shaped failure')).toBeInTheDocument();
    });
});
