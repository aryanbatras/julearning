import React, { useState, useEffect } from 'react';
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
import LoadingScreen from '@/components/LoadingScreen';
import PageTransition from '@/components/PageTransition';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="spinner"></div>
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
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
    <Footer />
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    console.log('App component mounted, starting loading...');

    // Force show loading screen for testing (uncomment to test)
    localStorage.removeItem('hasVisitedJU');

    // Always show loading screen for minimum time to ensure smooth experience
    const minimumLoadingTime = setTimeout(() => {
      console.log('Minimum loading time completed');
      setIsLoading(false);
    }, 2000);

    // Check if user has visited before (for production)
    const hasVisited = localStorage.getItem('hasVisitedJU');
    if (hasVisited) {
      console.log('User has visited before, reducing loading time');
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisitedJU', 'true');
      }, 1000);
    } else {
      console.log('First time visitor, showing full loading experience');
      // For first-time visitors, show longer loading
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisitedJU', 'true');
      }, 4000);
    }

    return () => {
      clearTimeout(minimumLoadingTime);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.log('Loading completed, hiding loading screen');
      const hideTimer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // Small delay for smooth transition

      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  if (showLoading) {
    console.log('Rendering loading screen...');
    return <LoadingScreen onLoadingComplete={() => {
      console.log('Loading screen completed');
      setIsLoading(false);
    }} />;
  }

  console.log('Rendering main app...');
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