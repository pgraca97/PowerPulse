// src/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ProfileEdit } from './pages/ProfileEdit';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ExerciseDetails } from './pages/ExerciseDetails';
import AdminDashboard from './pages/AdminDashboard';

export function AppRoutes() {
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
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/exercise/:id" element={<ExerciseDetails />} />

        <Route 
        path="/admin" 
        element={<ProtectedRoute component={AdminDashboard} requireAdmin />} 
        />
        
      </Route>
    </Routes>
  );
}