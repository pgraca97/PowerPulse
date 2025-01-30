import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ProfileEdit } from './pages/ProfileEdit';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ExerciseDetails } from './pages/ExerciseDetails';
import { useProfile } from './hooks/useProfile';

export function AppRoutes() {
  const { profile } = useProfile();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="dashboard"
          element={<ProtectedRoute component={Dashboard} />}
        />
        <Route
          path="profile/edit"
          element={<ProtectedRoute component={ProfileEdit} />}
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute 
              component={
                () => profile?.isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />
              } 
            />
          }
        />
        <Route path="exercise/:id" element={<ExerciseDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}