import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './router/AppRouter';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
