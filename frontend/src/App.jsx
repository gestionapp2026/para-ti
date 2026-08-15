import { Routes, Route, Navigate } from 'react-router-dom';
import GirlfriendView from './pages/GirlfriendView.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function AdminGate({ children }) {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GirlfriendView />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminGate>
            <AdminDashboard />
          </AdminGate>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
