import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Home, BookOpen, Library, LogOut, User, LogIn, GalleryHorizontal, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Elaborate Circular Menu Animation Styles
const elaborateMenuStyles = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

body{
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
}

.section-center{
  position: absolute;
  top: 50%;
  left: 0;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  z-index: 6;
  text-align: center;
  transform: translateY(-50%);
}

[type="checkbox"]:checked,
[type="checkbox"]:not(:checked){
  position: absolute;
  left: -9999px;
}

.menu-icon:checked + label,
.menu-icon:not(:checked) + label{
  position: fixed;
  top: 63px;
  right: 75px;
  display: block;
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  z-index: 1000;
}

.menu-icon:checked + label:before,
.menu-icon:not(:checked) + label:before{
  position: absolute;
  content: '';
  display: block;
  width: 30px;
  height: 20px;
  z-index: 20;
  top: 0;
  left: 0;
  border-top: 2px solid #ececee;
  border-bottom: 2px solid #ececee;
  transition: border-width 100ms 1500ms ease,
              top 100ms 1600ms cubic-bezier(0.23, 1, 0.32, 1),
              height 100ms 1600ms cubic-bezier(0.23, 1, 0.32, 1),
              background-color 200ms ease,
              transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.menu-icon:checked + label:after,
.menu-icon:not(:checked) + label:after{
  position: absolute;
  content: '';
  display: block;
  width: 22px;
  height: 2px;
  z-index: 20;
  top: 10px;
  right: 4px;
  background-color: #ececee;
  margin-top: -1px;
  transition: width 100ms 1750ms ease,
              right 100ms 1750ms ease,
              margin-top 100ms ease,
              transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.menu-icon:checked + label:before{
  top: 10px;
  transform: rotate(45deg);
  height: 2px;
  background-color: #ececee;
  border-width: 0;
  transition: border-width 100ms 340ms ease,
              top 100ms 300ms cubic-bezier(0.23, 1, 0.32, 1),
              height 100ms 300ms cubic-bezier(0.23, 1, 0.32, 1),
              background-color 200ms 500ms ease,
              transform 200ms 1700ms cubic-bezier(0.23, 1, 0.32, 1);
}

.menu-icon:checked + label:after{
  width: 30px;
  margin-top: 0;
  right: 0;
  transform: rotate(-45deg);
  transition: width 100ms ease,
              right 100ms ease,
              margin-top 100ms 500ms ease,
              transform 200ms 1700ms cubic-bezier(0.23, 1, 0.32, 1);
}

.nav{
  position: fixed;
  top: 33px;
  right: 50px;
  display: block;
  width: 80px;
  height: 80px;
  padding: 0;
  margin: 0;
  z-index: 999;
  overflow: hidden;
  background-color: #353746;
  animation: border-transform 7s linear infinite;
  transition: top 350ms 1100ms cubic-bezier(0.23, 1, 0.32, 1),
              right 350ms 1100ms cubic-bezier(0.23, 1, 0.32, 1),
              transform 250ms 1100ms ease,
              width 650ms 400ms cubic-bezier(0.23, 1, 0.32, 1),
              height 650ms 400ms cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes border-transform{
  0%,100% { border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%; }
  14% { border-radius: 40% 60% 54% 46% / 49% 60% 40% 51%; }
  28% { border-radius: 54% 46% 38% 62% / 49% 70% 30% 51%; }
  42% { border-radius: 61% 39% 55% 45% / 61% 38% 62% 39%; }
  56% { border-radius: 61% 39% 67% 33% / 70% 50% 50% 30%; }
  70% { border-radius: 50% 50% 34% 66% / 56% 68% 32% 44%; }
  84% { border-radius: 46% 54% 50% 50% / 35% 61% 39% 65%; }
}

.menu-icon:checked ~ .nav {
  animation-play-state: paused;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  width: 200vw;
  height: 200vh;
  transition: top 350ms 700ms cubic-bezier(0.23, 1, 0.32, 1),
              right 350ms 700ms cubic-bezier(0.23, 1, 0.32, 1),
              transform 250ms 700ms ease,
              width 750ms 1000ms cubic-bezier(0.23, 1, 0.32, 1),
              height 750ms 1000ms cubic-bezier(0.23, 1, 0.32, 1);
}

.nav ul{
  position: absolute;
  top: 50%;
  left: 0;
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  z-index: 6;
  text-align: center;
  transform: translateY(-50%);
  list-style: none;
}

.nav ul li{
  position: relative;
  display: block;
  width: 0%;
  padding: 0;
  margin: 5px 0;
  text-align: center;
  list-style: none;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(30px);
  transition: all 250ms linear;
}

.menu-icon:not(:checked) ~ .nav ul li {
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(30px) !important;
  pointer-events: none !important;
  transition: opacity 250ms ease 0ms,
              transform 250ms ease 0ms,
              visibility 0ms ease 0ms;
}

.nav ul li:nth-child(1){
  transition-delay: 200ms;
}

.nav ul li:nth-child(2){
  transition-delay: 150ms;
}

.nav ul li:nth-child(3){
  transition-delay: 100ms;
}

.nav ul li:nth-child(4){
  transition-delay: 50ms;
}

.nav ul li:nth-child(5){
  transition-delay: 0ms;
}

.nav ul li a{
  font-family: 'Montserrat', sans-serif;
  font-size: 4vh;
  text-transform: uppercase;
  line-height: 1.2;
  font-weight: 800;
  display: inline-block;
  position: relative;
  color: #ececee;
  transition: all 250ms linear;
  text-decoration: none;
}

.nav ul li a:hover{
  text-decoration: none;
  color: #ffeba7;
}

.nav ul li a:after{
  display: block;
  position: absolute;
  top: 50%;
  content: '';
  height: 0.5vh;
  margin-top: -0.25vh;
  width: 0;
  left: 0;
  background-color: #353746;
  opacity: 0.8;
  transition: width 250ms linear;
}

.nav ul li a:hover:after{
  width: 100%;
}

.menu-icon:checked ~ .nav ul li {
  pointer-events: auto;
  visibility: visible;
  opacity: 0.75;
  transform: scale(1.35);
  transition: opacity 2.5s ease,
              transform 2s ease;
}

.menu-icon:checked ~ .nav ul li:nth-child(1){
  transition-delay: 1400ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(2){
  transition-delay: 1480ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(3){
  transition-delay: 1560ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(4){
  transition-delay: 1640ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(5){
  transition-delay: 1720ms;
  opacity : 1;
}

@media screen {
  .menu-icon:checked + label,
  .menu-icon:not(:checked) + label{
    right: 55px;
  }
  .nav{
    right: 30px;
  }
  .nav ul li a{
    font-size: 3vh;
  }
  

  /* Mobile-specific menu sizing */
  .menu-icon:checked ~ .nav {
    width: 150vw;
    height: 150vh;
    top: -25vh;
    right: -25vw;
    transform: none;
    border-radius: 0;
  }

  /* Better mobile menu item positioning */
  .menu-icon:checked ~ .nav ul {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    max-width: 300px;
  }

  .menu-icon:checked ~ .nav ul li {
    margin: 8px 0;
    text-align: center;
  }
}

.logo {
  position: absolute;
  top: 60px;
  left: 50px;
  display: block;
  z-index: 11;
  transition: all 250ms linear;
}

.logo img {
  height: 26px;
  width: auto;
  display: block;
}
`;

const NavItem = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
        isActive ? 'bg-accent text-secondary' : 'text-gray-600 hover:bg-gray-100 hover:text-foreground'
      }`
    }
  >
    {icon}
    <span className="hidden lg:inline">{children}</span>
  </NavLink>
);

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Inject elaborate menu styles into document head
    const styleId = 'elaborate-menu-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = elaborateMenuStyles;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Cleanup function to remove styles when component unmounts
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const getMobileMenuLinks = () => {
    if (user) {
      if (profile?.role === 'student') {
        return (
          <>
            <li><a href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a></li>
            <li><a href="/courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</a></li>
            <li><a href="/my-courses" onClick={() => setIsMobileMenuOpen(false)}>My Courses</a></li>
            <li><a href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a></li>
            <li><a href="/team" onClick={() => setIsMobileMenuOpen(false)}>Team</a></li>
          </>
        );
      } else if (profile?.role === 'admin') {
        return (
          <>
            <li><a href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a></li>
            <li><a href="/admin/courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</a></li>
            <li><a href="/admin/team" onClick={() => setIsMobileMenuOpen(false)}>Team</a></li>
            <li><a href="/admin/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a></li>
          </>
        );
      }
    }

    // Default links for non-logged in users
    return (
      <>
        <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
        <li><a href="/courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</a></li>
        <li><a href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
        <li><a href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a></li>
        <li><a href="/team" onClick={() => setIsMobileMenuOpen(false)}>Team</a></li>
      </>
    );
  };

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

            {user && profile ? (
              <div className="hidden md:flex items-center gap-1 text-sm">
                {profile.role === 'student' ? (
                  <>
                    <NavItem to="/dashboard" icon={<Home className="w-4 h-4" />}>Home</NavItem>
                    <NavItem to="/courses" icon={<BookOpen className="w-4 h-4" />}>Courses</NavItem>
                    <NavItem to="/my-courses" icon={<Library className="w-4 h-4" />}>My Courses</NavItem>
                    <NavItem to="/gallery" icon={<GalleryHorizontal className="w-4 h-4" />}>Gallery</NavItem>
                    <NavItem to="/team" icon={<Users className="w-4 h-4" />}>Team</NavItem>
                  </>
                ) : (
                  // Admin navigation
                  <>
                    <NavItem to="/admin" icon={<Home className="w-4 h-4" />}>Dashboard</NavItem>
                    <NavItem to="/admin/courses" icon={<BookOpen className="w-4 h-4" />}>Courses</NavItem>
                    <NavItem to="/admin/team" icon={<Users className="w-4 h-4" />}>Team</NavItem>
                    <NavItem to="/admin/gallery" icon={<GalleryHorizontal className="w-4 h-4" />}>Gallery</NavItem>
                  </>
                )}
              </div>
            ) : (
              // Non-authenticated users - show basic navigation
              <div className="hidden md:flex items-center gap-1 text-sm">
                <NavItem to="/" icon={<Home className="w-4 h-4" />}>Home</NavItem>
                <NavItem to="/courses" icon={<BookOpen className="w-4 h-4" />}>Courses</NavItem>
                <NavItem to="/about" icon={<Users className="w-4 h-4" />}>About</NavItem>
                <NavItem to="/gallery" icon={<GalleryHorizontal className="w-4 h-4" />}>Gallery</NavItem>
                <NavItem to="/team" icon={<Users className="w-4 h-4" />}>Team</NavItem>
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
              <div>
                <input className="menu-icon" type="checkbox" id="menu-icon" name="menu-icon" checked={isMobileMenuOpen} onChange={(e) => setIsMobileMenuOpen(e.target.checked)} />
                <label htmlFor="menu-icon"></label>
                <nav className="nav">
                  <ul className="pt-5">
                    {getMobileMenuLinks()}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;