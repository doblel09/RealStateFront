import { useAuth, type User } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PersonLogo from '@/assets/person-button.svg';
import { useEffect, useState } from 'react';

const Profile = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      setUser(auth.user);
    }
  }, [auth?.user]);

  const getProfilePicture = () => {
    if (user?.profilePicture) {
      const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const cleanPicture = user.profilePicture.startsWith('/') ? user.profilePicture : `/${user.profilePicture}`;
      return `${cleanBaseUrl}${cleanPicture}`;
    }
    return PersonLogo;
  };

  const handleEditProfile = () => {
    navigate('/manage-account');
  };

  return (
    <div className='container mx-auto p-4 max-w-2xl'>
      <h1 className='text-2xl font-bold mb-6'>User Profile</h1>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6 mb-6'>
          <img 
            src={getProfilePicture()} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PersonLogo;
            }}
          />
          
          <div className='flex-1 text-center md:text-left'>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              {user?.firstName || 'N/A'} {user?.lastName || ''}
            </h2>
          </div>

          <button
            onClick={handleEditProfile}
            className='bg-[#619154] hover:bg-[#557A49] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Cédula
            </label>
            <p className='text-lg text-gray-900'>
              {user?.cedula || 'Not provided'}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <p className='text-lg text-gray-900 break-all'>
              {user?.email || 'Not provided'}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Phone Number
            </label>
            <p className='text-lg text-gray-900'>
              {user?.phoneNumber || 'Not provided'}
            </p>
          </div>
        </div>

        <div className='mt-6 pt-6 border-t border-gray-200'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>

            <div className='flex items-center gap-2'>
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className='text-sm font-medium text-gray-700'>Account Type:</span>
              <span className='text-sm font-semibold text-green-600'>
                {auth?.roles?.includes('Agent') ? 'Agent' : 'Customer'}
              </span>
            </div>

            <button
              onClick={handleEditProfile}
              className='md:hidden bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm'
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6 bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
        <div className='flex flex-wrap gap-3'>
          
          <button
            onClick={handleEditProfile}
            className='flex items-center gap-2 bg-[#619154] hover:bg-[#557A49] text-white px-4 py-2 rounded-lg transition-colors text-sm'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>

          <button
            onClick={() => navigate('/buy')}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Browse Properties
          </button>

          <button
            onClick={() => navigate('/rent')}
            className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm'
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Find Rentals
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
