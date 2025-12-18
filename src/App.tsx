import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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

function App() {
  return (
    <Router>
      <div className="cyber-grid" />
      <div className="scan-line" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
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
                </Routes>
                <Footer />
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
