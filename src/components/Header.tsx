import PersonLogo from '@/assets/person-button.svg';
import SearchHeader from './SearchHeader';
import Logo from '@/assets/header-logo.svg';
import { Link } from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth';
import { useEffect } from 'react';


const Header = () => {
  const auth = useAuth();
  const user = auth?.user;
  const roles = auth?.roles;
  const logout = auth?.logout;

  useEffect(() => {
    console.log("User roles:", roles);
  }, [roles]);

  const getProfilePicture = () => {
  if (user?.profilePicture) {
    return import.meta.env.VITE_BACKEND_BASE_URL + user.profilePicture;
  }
  return PersonLogo;
};

  return (
    <div className="bg-[#FFFFFF] w-full h-[4rem] flex items-center justify-between px-4 md:px-8 border-b-2 border-[#E5E8EB]">
        
        <div className="flex items-center gap-8">
            <Link to="/">
            <div className="flex items-center gap-2">
            
              <img src={Logo} alt="Logo" className="w-5 h-5" />
              <h1 className="text-xl font-bold">RealState App</h1>
            </div>
          </Link>

          <nav className="hidden md:flex">
        <ul className="flex gap-8">
          {roles && roles.includes("Agent") ? <li><Link to="/listings">My listings</Link></li> : null}
          {!roles || !roles.includes("Agent") ? (
            <>
            <li><Link to="/buy">Buy</Link></li>
            <li><Link to="/rent">Rent</Link></li>
            <li><Link to="/agents">Find an Agent</Link></li>
            </>
            ) : null}
        </ul>
      </nav>
      </div>
      
      
      <div className='flex items-center gap-4'>
        <SearchHeader />
        <div className='flex items-center gap-2 cursor-pointer'>
            <Link to={user ? roles?.includes("Agent") ? `/agent/${user.id}` : "/profile" : "/login"} className="flex items-center">
            <img src={getProfilePicture()} alt="User Profile" className="w-8 h-8 rounded-full ml-4" />
            </Link>
            {user ? (
              <>
                <Link to={user ? roles?.includes("Agent") ? `/agent/${user.id}` : "/profile" : "/login"} className="hidden md:inline-block">Hello, {user.firstName}</Link>
                <button onClick={logout} className="px-4 py-2 hidden md:block">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-[#619154] text-white px-4 py-2 rounded-lg ml-4 hover:bg-[#5a8b4c] hidden md:block">
                Login
              </Link>
            )}
        </div>
      </div>
      
    </div>
  )
}

export default Header
