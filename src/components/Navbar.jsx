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
  transition: border-width 100ms 50ms ease,
              top 100ms 75ms cubic-bezier(0.23, 1, 0.32, 1),
              height 100ms 75ms cubic-bezier(0.23, 1, 0.32, 1),
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
  transition: width 100ms 100ms ease,
              right 100ms 100ms ease,
              margin-top 100ms ease,
              transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.menu-icon:checked + label:before{
  top: 10px;
  transform: rotate(45deg);
  height: 2px;
  background-color: #ececee;
  border-width: 0;
  transition: border-width 100ms 50ms ease,
              top 100ms 50ms cubic-bezier(0.23, 1, 0.32, 1),
              height 100ms 50ms cubic-bezier(0.23, 1, 0.32, 1),
              background-color 200ms 100ms ease,
              transform 200ms 100ms cubic-bezier(0.23, 1, 0.32, 1);
}

.menu-icon:checked + label:after{
  width: 30px;
  margin-top: 0;
  right: 0;
  transform: rotate(-45deg);
  transition: width 100ms ease,
              right 100ms ease,
              margin-top 100ms 100ms ease,
              transform 200ms 100ms cubic-bezier(0.23, 1, 0.32, 1);
}

.nav{
  position: fixed;
  top: 33px;
  right: 50px;
  display: block;
  width: 75px;
  height: 75px;
  padding: 0;
  margin: 0;
  z-index: 999;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%);
  animation: border-transform 7s linear infinite;
  transition: top 350ms 100ms cubic-bezier(0.23, 1, 0.32, 1),
              right 350ms 100ms cubic-bezier(0.23, 1, 0.32, 1),
              transform 250ms 100ms ease,
              width 650ms 100ms cubic-bezier(0.23, 1, 0.32, 1),
              height 650ms 100ms cubic-bezier(0.23, 1, 0.32, 1);
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
  transition: top 350ms 100ms cubic-bezier(0.23, 1, 0.32, 1),
              right 350ms 100ms cubic-bezier(0.23, 1, 0.32, 1),
              transform 250ms 100ms ease,
              width 750ms 100ms cubic-bezier(0.23, 1, 0.32, 1),
              height 750ms 100ms cubic-bezier(0.23, 1, 0.32, 1);
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
  transition-delay: 500ms;
}

.nav ul li:nth-child(4){
  transition-delay: 50ms;
}

.nav ul li:nth-child(5){
  transition-delay: 0ms;
}

.nav ul li:nth-child(6){
  transition-delay: -50ms;
}

.nav ul li a{
  font-family: 'Montserrat', sans-serif;
  font-size: 8.5vh;
  text-transform: uppercase;
  line-height: 3;
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
  bottom: 30px;
  left: 0;
  content: '';
  height: 3px;
  width: 0;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  animation: pulse-glow 2s ease-in-out infinite alternate;
  transition: width 300ms ease;
  border-radius: 2px;
}

.nav ul li:nth-child(1) a:hover:after{
  width: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

.nav ul li:nth-child(2) a:hover:after{
  width: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

.nav ul li:nth-child(3) a:hover:after{
  width: 100%;
  background: linear-gradient(90deg, #ec4899, #f59e0b);
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

.nav ul li:nth-child(4) a:hover:after{
  width: 100%;
  background: linear-gradient(90deg, #f59e0b, #10b981);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from {
    box-shadow: 0 0 5px rgba(245, 158, 11, 0.3);
  }
  to {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.8);
  }
}

.nav ul li:nth-child(5) a:hover:after{
  width: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

.nav ul li:nth-child(6) a:hover:after{
  width: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

@keyframes bounce-scale {
  0% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}

.menu-icon:checked ~ .nav ul li {
  pointer-events: auto;
  visibility: visible;
  opacity: 0;
  transform: scale(1.45);
  transition: opacity 1s ease,
              transform 1.5s ease;
}

.menu-icon:checked ~ .nav ul li:nth-child(1){
  transition-delay: 50ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(2){
  transition-delay: 75ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(3){
  transition-delay: 100ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(4){
  transition-delay: 125ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(5){
  transition-delay: 150ms;
  opacity : 1;
}

.menu-icon:checked ~ .nav ul li:nth-child(6){
  transition-delay: 175ms;
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
    width: 200vw;
    height: 200vh;
    top: -42vh;
    right: -42vw;
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

/* New Animated Button Styles */
.nav-item {
  display: inline-block;
  margin: 0 5px;
}

.nav-button {
  position: relative;
  padding: 10px 20px;
  border-radius: 7px;
  border: 1px solid transparent;  /* Transparent border by default */
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  background: transparent;
  color: rgb(61, 106, 255);  /* Blue text for better visibility */
  overflow: hidden;
  box-shadow: 0 0 0 0 transparent;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.nav-button:hover {
  background: rgb(61, 106, 255);
  border: 1px solid rgb(61, 106, 255);  /* Show border on hover */
  box-shadow: 0 0 30px 5px rgba(0, 142, 236, 0.815);
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
  color: #fff;  /* White text on hover */
}

.nav-button:hover::before {
  -webkit-animation: sh02 0.5s 0s linear;
  -moz-animation: sh02 0.5s 0s linear;
  animation: sh02 0.5s 0s linear;
}

.nav-button::before {
  content: '';
  display: block;
  width: 0px;
  height: 86%;
  position: absolute;
  top: 7%;
  left: 0%;
  opacity: 0;
  background: #fff;
  box-shadow: 0 0 50px 30px #fff;
  -webkit-transform: skewX(-20deg);
  -moz-transform: skewX(-20deg);
  -ms-transform: skewX(-20deg);
  -o-transform: skewX(-20deg);
  transform: skewX(-20deg);
}

@keyframes sh02 {
  from {
    opacity: 0;
    left: 0%;
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0;
    left: 100%;
  }
}

.nav-button:active {
  box-shadow: 0 0 0 0 transparent;
  -webkit-transition: box-shadow 0.2s ease-in;
  -moz-transition: box-shadow 0.2s ease-in;
  transition: box-shadow 0.2s ease-in;
}

.nav-text {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgb(61, 106, 255);  /* Blue text for better visibility */
}

.nav-item.active .nav-button {
  background: rgb(61, 106, 255);
  color: #fff;
}

.nav-item.active .nav-text {
  color: #fff;  /* White text for active state */
}

.nav-button:hover {
  background: rgb(61, 106, 255) !important;
  border: 1px solid rgb(61, 106, 255) !important;
  box-shadow: 0 0 30px 5px rgba(0, 142, 236, 0.815) !important;
  -webkit-transition: all 0.2s ease-out !important;
  -moz-transition: all 0.2s ease-out !important;
  transition: all 0.2s ease-out !important;
  color: #fff !important;  /* Force white text on hover for all nav buttons */
}

.nav-button:hover .nav-text {
  color: #fff !important;  /* Force white text in nav-text span on hover */
}

.nav-button:hover::before {
  -webkit-animation: sh02 0.5s 0s linear !important;
  -moz-animation: sh02 0.5s 0s linear !important;
  animation: sh02 0.5s 0s linear !important;
}
`;

const NavItem = ({ to, icon, children, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
        }
    >
        <button className="nav-button">
            {icon}
            <span className="hidden lg:inline nav-text">{children}</span>
        </button>
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
        navigate('/');
        // Refresh the page to ensure complete logout
        window.location.reload();
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    const getMobileMenuLinks = () => {
        if (user) {
            if (profile?.role === 'student') {
                return (
                    <>
                        <li><a href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a></li>
                        <li><a href="/courses" onClick={() => setIsMobileMenuOpen(false)}>Search</a></li>
                        <li><a href="/my-courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</a></li>
                        <li><a href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a></li>
                        <li><a href="/blogs" onClick={() => setIsMobileMenuOpen(false)}>Blogs</a></li>
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
                        <li><a href="/blogs" onClick={() => setIsMobileMenuOpen(false)}>Blogs</a></li>
                    </>
                );
            }
        }

        // Default links for non-logged in users
        return (
            <>
                <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
                <li><a href="/courses" onClick={() => setIsMobileMenuOpen(false)}>Search</a></li>
                <li><a href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
                <li><a href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a></li>
                <li><a href="/blogs" onClick={() => setIsMobileMenuOpen(false)}>Blogs</a></li>
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
                            <span className="text-xl font-bold text-secondary leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600  ">JU LEARNING</span>
                        </Link>

                        {user && profile ? (
                            <div className="hidden md:flex items-center gap-1 text-sm">
                                {profile.role === 'student' ? (
                                    <>
                                        <NavItem to="/dashboard" icon={<Home className="w-4 h-4" />}>Home</NavItem>
                                        <NavItem to="/courses" icon={<BookOpen className="w-4 h-4" />}>Search</NavItem>
                                        <NavItem to="/my-courses" icon={<Library className="w-4 h-4" />}>Courses</NavItem>
                                        <NavItem to="/gallery" icon={<GalleryHorizontal className="w-4 h-4" />}>Gallery</NavItem>
                                        <NavItem to="/blogs" icon={<BookOpen className="w-4 h-4" />}>Blogs</NavItem>
                                        <NavItem to="/team" icon={<Users className="w-4 h-4" />}>Team</NavItem>
                                    </>
                                ) : (
                                    // Admin navigation
                                    <>
                                        <NavItem to="/admin" icon={<Home className="w-4 h-4" />}>Dashboard</NavItem>
                                        <NavItem to="/admin/courses" icon={<BookOpen className="w-4 h-4" />}>Courses</NavItem>
                                        <NavItem to="/admin/team" icon={<Users className="w-4 h-4" />}>Team</NavItem>
                                        <NavItem to="/admin/gallery" icon={<GalleryHorizontal className="w-4 h-4" />}>Gallery</NavItem>
                                        <NavItem to="/blogs" icon={<BookOpen className="w-4 h-4" />}>Blogs</NavItem>
                                    </>
                                )}
                            </div>
                        ) : (
                            // Non-authenticated users - show basic navigation
                            <div className="hidden md:flex items-center gap-1 text-sm">
                                <NavItem to="/" icon={<Home className="w-4 h-4" />}>Home</NavItem>
                                <NavItem to="/courses" icon={<BookOpen className="w-4 h-4" />}>Search</NavItem>
                                <NavItem to="/about" icon={<Users className="w-4 h-4" />}>About</NavItem>
                                <NavItem to="/gallery" icon={<GalleryHorizontal className="w-4 h-4" />}>Gallery</NavItem>
                                <NavItem to="/blogs" icon={<BookOpen className="w-4 h-4" />}>Blogs</NavItem>
                                <NavItem to="/team" icon={<Users className="w-4 h-4" />}>Team</NavItem>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {user && profile ? (
                                <Button
                                    onClick={handleLogout}
                                    className="nav-button gap-2"
                                    style={{
                                        position: 'relative',
                                        padding: '10px 20px',
                                        borderRadius: '7px',
                                        border: '1px solid transparent',
                                        fontSize: '14px',
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        letterSpacing: '2px',
                                        background: 'transparent',
                                        color: 'rgb(61, 106, 255)',  /* Blue text for better visibility */
                                        overflow: 'hidden',
                                        boxShadow: '0 0 0 0 transparent',
                                        transition: 'all 0.2s ease-in',
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button
                                            className="nav-button"
                                            style={{
                                                position: 'relative',
                                                padding: '8px 16px',
                                                borderRadius: '7px',
                                                border: '1px solid transparent',
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                fontWeight: '600',
                                                letterSpacing: '1.5px',
                                                background: 'transparent',
                                                color: 'rgb(61, 106, 255)',
                                                overflow: 'hidden',
                                                boxShadow: '0 0 0 0 transparent',
                                                transition: 'all 0.2s ease-in',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <LogIn className="w-5 h-5" />
                                            <span className="hidden sm:inline">Login</span>
                                        </Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button
                                            className="nav-button"
                                            style={{
                                                position: 'relative',
                                                padding: '8px 16px',
                                                borderRadius: '7px',
                                                border: '1px solid transparent',
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                fontWeight: '600',
                                                letterSpacing: '1.5px',
                                                background: 'transparent',
                                                color: 'rgb(61, 106, 255)',
                                                overflow: 'hidden',
                                                boxShadow: '0 0 0 0 transparent',
                                                transition: 'all 0.2s ease-in',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="hidden sm:inline">Sign Up</span>
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