import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Home, BookOpen, Library, LogOut, User, LogIn, GalleryHorizontal, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors ${
        isActive ? 'bg-accent text-secondary' : 'text-gray-600 hover:bg-gray-100 hover:text-foreground'
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return null;
  }

  const navLinks = user ? (
    profile?.role === 'student' ? (
      <>
        <NavItem to="/dashboard" icon={<Home className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Home</NavItem>
        <NavItem to="/courses" icon={<BookOpen className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Courses</NavItem>
        <NavItem to="/my-courses" icon={<Library className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>My Courses</NavItem>
        <NavItem to="/gallery" icon={<GalleryHorizontal className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Gallery</NavItem>
        <NavItem to="/team" icon={<Users className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Team</NavItem>
      </>
    ) : profile?.role === 'admin' ? (
      <>
        <NavItem to="/admin" icon={<Home className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavItem>
        <NavItem to="/admin/courses" icon={<BookOpen className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Courses</NavItem>
        <NavItem to="/admin/team" icon={<Users className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Team</NavItem>
        <NavItem to="/admin/gallery" icon={<GalleryHorizontal className="w-5 h-5" />} onClick={() => setIsMobileMenuOpen(false)}>Gallery</NavItem>
      </>
    ) : null
  ) : null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={user ? (profile?.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary">
                JU Learning
              </span>
            </Link>

            {user && profile?.role === 'student' && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks}
              </div>
            )}

            <div className="flex items-center gap-2">
              {user && profile ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="gap-2 hidden sm:flex">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="gap-2">
                      <User className="w-4 h-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;