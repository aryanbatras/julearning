import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import StudentDashboard from '@/pages/StudentDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CoursesPage from '@/pages/CoursesPage';
import MyCoursesPage from '@/pages/MyCoursesPage';
import CourseDetailsPage from '@/pages/CourseDetailsPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ContactPage from '@/pages/ContactPage';
import TeamPage from '@/pages/TeamPage';
import GalleryPage from '@/pages/GalleryPage';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>JU Learning Portal - Jammu University</title>
        <meta name="description" content="Educational portal for Jammu University students with courses, notes, and learning resources" />
      </Helmet>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<AppLayout />}>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
          </Route>

          <Route 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-courses" 
              element={
                <ProtectedRoute allowedRole="student">
                  <MyCoursesPage />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="admin" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;