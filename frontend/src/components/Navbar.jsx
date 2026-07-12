import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">IssuePilot AI</Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="hover:text-sky-300">Dashboard</Link>
          <Link to="/projects" className="hover:text-sky-300">Projects</Link>
          <Link to="/issues" className="hover:text-sky-300">Issues</Link>
          <span className="text-sm text-slate-300">{user?.name}</span>
          <button onClick={handleLogout} className="bg-slate-700 px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
