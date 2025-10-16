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
import { AuthProvider } from '@/hooks/useAuth'
import PrivateRoute from '@/pages/PrivateRoute'
import PublicRoute from '@/pages/PublicRoute'
import ManageUser from '@/pages/ManageUser'
import Profile from '@/pages/Profile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider is inside the Router so useNavigate can be used in the provider */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="details" element={<Details />} />
            <Route path="buy" element={<Buy />} />
            <Route path="rent" element={<Rent />} />
            <Route path="agents" element={<Agents />} />
            <Route path="agent/:id" element={<Agent />} />
            <Route element={<PrivateRoute />}>
              <Route path="manage-property" element={<ManageProperty />} />
              <Route path="listings" element={<Listings />} />
              <Route path="create-listing" element={<ManageProperty />} />
              <Route path="manage-listing/:id" element={<ManageProperty />} />
              <Route path="manage-account" element={<ManageUser />} />
              <Route path="profile" element={<Profile />} />
            </Route>
           <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);