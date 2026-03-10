import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import NewPrescription from './components/Prescriptions/NewPrescription';
import Reports from './pages/Reports';
import Login from './pages/Login';
import NewPatient from './components/Patients/NewPatient';
import Profile from './pages/Profile';
import PatientProfile from './pages/PatientProfile';
import PatientPortal from './pages/PatientPortal';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/portal/:patientId" element={<PatientPortal />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="patients">
            <Route index element={<Patients />} />
            <Route path="new" element={<NewPatient />} />
            <Route path=":id" element={<PatientProfile />} />
          </Route>

          <Route path="appointments" element={<Appointments />} />

          <Route path="prescriptions">
            <Route index element={<Prescriptions />} />
            <Route path="new" element={<NewPrescription />} />
          </Route>

          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
