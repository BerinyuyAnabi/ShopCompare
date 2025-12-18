import { useNavigate } from 'react-router-dom';

const Logout = ({ className = 'logout-btn' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
};

export default Logout;
