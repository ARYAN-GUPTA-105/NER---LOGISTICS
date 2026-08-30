import React from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { RoleSelection } from './components/RoleSelection';
import { RoleLogin } from './components/RoleLogin';
import { useAuth } from './context/AuthContext';
import { DriverProvider } from './driver/DriverContext';
import { DriverApp } from './driver/DriverApp';
import type { RoleId } from './data/roles';

const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: RoleId }>();

  // If role is invalid, go back to role selection
  const validRoles = ['driver', 'logistics_company', 'field_officer', 'authority_admin'];
  if (role && !validRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  const handleChangeRole = () => {
    navigate('/');
  };

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return <RoleLogin roleId={role as RoleId} onChangeRole={handleChangeRole} />;
};

const RoleSelectionRoute: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRoleSelection = (role: RoleId) => {
    navigate(`/login/${role}`);
  };

  return <RoleSelection onContinue={handleRoleSelection} />;
};

const DriverRoute: React.FC = () => {
  const { authState, user } = useAuth();

  if (authState !== 'authenticated' || user?.roleId !== 'driver') {
    return <Navigate to="/login/driver" replace />;
  }

  return (
    <DriverProvider>
      <DriverApp />
    </DriverProvider>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionRoute />} />
      <Route path="/login/:role" element={<LoginRoute />} />
      <Route path="/driver/*" element={<DriverRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
