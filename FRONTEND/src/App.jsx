import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';  // provider component (state + context)
import AuthContext from './context/AuthContext';    // context object (if needed)

// Import your pages & components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notice from './pages/Notice';
import CreateNotice from './pages/CreateNotice';
import ApplyLeave from './pages/ApplyLeave';
import LeaveRequest from './pages/LeaveRequests';
import Schedule from './pages/Schedule';
import CreateEditSchedule from './pages/CreateEditSchedule';
import EditSchedule from './pages/EditSchedule';
import MyLeaves from './pages/MyLeaves';

// PrivateRoute component supporting role-based authorization
const PrivateRoute = ({ children, requiredRole }) => {
  const { token, user } = React.useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (!user || !requiredRole.includes(user.role))) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

// Optional: custom 404 page component
const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          {/* Protected routes */}
          <Route
            path="/notices"
            element={
              <PrivateRoute>
                <Notice />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-notice"
            element={
              <PrivateRoute requiredRole={['admin', 'teacher']}>
                <CreateNotice />
              </PrivateRoute>
            }
          />
          <Route
            path="/apply-leave"
            element={
              <PrivateRoute requiredRole={['student']}>
                <ApplyLeave />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <PrivateRoute requiredRole={['student']}>
              <MyLeaves/>
              </PrivateRoute>
            }
          />
          <Route
            path="/leave-requests"
            element={
              <PrivateRoute requiredRole={['admin', 'teacher']}>
                <LeaveRequest />
              </PrivateRoute>
            }
          />

          {/* Public schedule viewing */}
          <Route path="/schedule" element={<Schedule />} />

          {/* Admin only schedule creation and editing */}
          <Route
            path="/create-schedule"
            element={
              <PrivateRoute requiredRole={['admin']}>
                <CreateEditSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-schedule"
            element={
              <PrivateRoute requiredRole={['admin']}>
                <EditSchedule />
              </PrivateRoute>
            }
          />

          {/* Catch-all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
