import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './layout/Layout';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import ServiceDetail from "./pages/ServiceDetail";
import BlogDetail from "./pages/BlogDetail";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/user/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthPage from './pages/auth/auth'
import Portfolio from './pages/Portfolio'
import PortfolioDetail from './pages/PortfolioDetail'


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><Home /></Layout>} />
        <Route path='/about' element={<Layout><About /></Layout>} />
        <Route path='/services' element={<Layout><Services /></Layout>} />
        <Route path='/blog' element={<Layout><Blog /></Layout>} />
        <Route path='/booking' element={<Layout><Booking /></Layout>} />
        <Route path='/contact' element={<Layout><Contact /></Layout>} />
        <Route path='/services/:slug' element={<Layout><ServiceDetail /></Layout>} />
        <Route path='/blog/:slug' element={<Layout><BlogDetail /></Layout>} />
        <Route path='/portfolio' element={<Layout><Portfolio /></Layout>} />
        <Route path='/portfolio/:slug' element={<Layout><PortfolioDetail /></Layout>} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;