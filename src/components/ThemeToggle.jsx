import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ inline = false }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`${inline ? '' : 'fixed top-6 right-6 z-50'} p-3 rounded-full bg-card border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group`}
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6">
                {/* Sun Icon */}
                <Sun
                    className={`absolute inset-0 h-6 w-6 text-yellow-500 transition-all duration-500 ${theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0'
                        }`}
                />
                {/* Moon Icon */}
                <Moon
                    className={`absolute inset-0 h-6 w-6 text-blue-400 transition-all duration-500 ${theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
