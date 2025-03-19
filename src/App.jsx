import { AuthProvider } from './contexts/AuthContext';
import Router from './routes/Router.jsx';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App; 