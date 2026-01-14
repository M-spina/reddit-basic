import { Link } from 'react-router-dom';
import ThemeToggle from '../features/ThemeToggle/ThemeToggle';

export default function Header() {
    return (
        <header className='header'>
            <Link to="/">
                <h1>Reddit Basic</h1>
            </Link>
            <ThemeToggle />
        </header>
    )
}

