import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from '@/pages/HomePage.tsx'
import Layout from '@/pages/Layout'
import Details from '@/pages/Details'
import Login from '@/pages/Login.tsx'
import ManageProperty from '@/pages/ManageProperty.tsx'
import SignUp from '@/pages/SignUp'
import Buy from '@/pages/Buy.tsx'
import Rent from '@/pages/Rent.tsx'
import Agents from '@/pages/Agents.tsx'
import Agent from '@/pages/Agent.tsx'
import Listings from '@/pages/Listings'
import { AuthProvider } from './hooks/useAuth'
import PrivateRoute from './pages/PrivateRoute'
import PublicRoute from './pages/PublicRoute'
import ManageUser from './pages/ManageUser'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider is inside the Router so useNavigate can be used in the provider */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="details" element={<Details />} />
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="manage-property" element={<PrivateRoute><ManageProperty /></PrivateRoute>} />
            <Route path="buy" element={<Buy />} />
            <Route path="rent" element={<Rent />} />
            <Route path="agents" element={<Agents />} />
            <Route path="agent/:id" element={<Agent />} />
            <Route path="listings" element={<PrivateRoute><Listings /></PrivateRoute>} />
            <Route path="create-listing" element={<PrivateRoute><ManageProperty /></PrivateRoute>} />
            <Route path="manage-listing/:id" element={<PrivateRoute><ManageProperty /></PrivateRoute>} />
            <Route path="manage-account" element={<PrivateRoute><ManageUser /></PrivateRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);