import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import TestBlock from './components/TestBlock';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorLogger from './components/ErrorLogger';
import { DebugPanel } from './components/DebugPanel';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Trial from './pages/Trial';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CourseDetail from './pages/CourseDetail';
import StudentWorks from './pages/StudentWorks';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import Privacy from './pages/Privacy';
import StudentAuth from './pages/StudentAuth';
import StudentDashboard from './pages/StudentDashboard';
import EmailConfirmation from './pages/EmailConfirmation';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="cyber-grid" />
        <div className="scan-line" />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/student/login" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <StudentAuth />
              </main>
            </div>
          } />
          <Route path="/student/confirm" element={
            <div className="app-layout">
              <Header />
              <main className="app-content">
                <EmailConfirmation />
              </main>
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
                  </Routes>
                  <TestBlock />
                  <Footer />
                </main>
              </div>
            }
          />
        </Routes>
        <CookieConsent />
        <ErrorLogger />
        <DebugPanel />
      </AuthProvider>
    </Router>
  );
}

export default App;
