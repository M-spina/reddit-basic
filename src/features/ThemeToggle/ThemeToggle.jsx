import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './themeSlice';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.mode);
    const isDark = theme === 'dark';

    return (
        <button
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span className="theme-toggle__icon">
                {isDark ? '☀️' : '🌙'}
            </span>
        </button>
    );
}