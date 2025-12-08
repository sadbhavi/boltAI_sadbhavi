
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import Home from './components/Home';
import BlogIndex from './components/blog/BlogIndex';
import BlogPostPage from './components/blog/BlogPost';
import AdminLogin from './components/admin/AdminLogin';
import BlogPostEditor from './components/admin/BlogPostEditor';
import BlogPostsList from './components/admin/BlogPostsList';
import AdminDashboard from './components/admin/AdminDashboard';
import UserFlow from './components/UserFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin onClose={() => window.location.href = '/'} onSuccess={() => window.location.href = '/admin/dashboard'} />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="posts" element={<BlogPostsList />} />
          <Route path="posts/new" element={<BlogPostEditor />} />
          <Route path="posts/:id" element={<BlogPostEditor />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="onboarding" element={<UserFlow onComplete={() => window.location.href = '/'} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
