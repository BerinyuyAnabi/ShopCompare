
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';

const Logout = ({ className = 'logout-btn' }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Use centralized apiFetch so base URL, credentials and timeout are handled
    try {
      await apiFetch('/logout.php', { method: 'POST' }, 5000);
    } catch (e) {
      // ignore errors 
      console.warn('Logout request failed (ignored):', e);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
};

export default Logout;
