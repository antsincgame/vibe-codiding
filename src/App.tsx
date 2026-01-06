import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const About = lazy(() => import('./pages/About'));
const Trial = lazy(() => import('./pages/Trial'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const StudentWorks = lazy(() => import('./pages/StudentWorks'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ProgrammingHistory = lazy(() => import('./pages/ProgrammingHistory'));
const StudentAuth = lazy(() => import('./pages/StudentAuth'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const EmailConfirmation = lazy(() => import('./pages/EmailConfirmation'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      color: 'var(--neon-cyan)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0, 255, 249, 0.3)',
        borderTop: '3px solid var(--neon-cyan)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="cyber-grid" />
        <div className="scan-line" />

        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={
            <div className="app-layout">
              <main className="app-content">
                <Login />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/admin" element={
            <div className="app-layout">
              <main className="app-content">
                <Admin />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/student/login" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <StudentAuth />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/student/confirm" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <EmailConfirmation />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/student/verify" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <VerifyEmail />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/student/forgot-password" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <ForgotPassword />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/student/reset-password" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <ResetPassword />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/student/dashboard" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              </main>
              <Footer />
            </div>
          } />
          <Route
            path="/*"
            element={
              <div className="app-layout">
                <Header />
                <main className="app-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/course/:slug" element={<CourseDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/trial" element={<Trial />} />
                    <Route path="/q-a" element={<FAQ />} />
                    <Route path="/works" element={<StudentWorks />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/history" element={<ProgrammingHistory />} />
                  </Routes>
                  <Footer />
                </main>
              </div>
            }
          />
        </Routes>
        </Suspense>
        <CookieConsent />
      </AuthProvider>
    </Router>
  );
}

export default App;
