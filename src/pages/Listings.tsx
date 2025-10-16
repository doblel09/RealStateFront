import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { agentStore } from "@/store/AgentStore";


const getStatusColor = (isAvailable: boolean) => {
  return isAvailable
    ? 'text-green-600 bg-green-50'
    : 'text-gray-600 bg-gray-50';
};


const Listings = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { listings, fetchAgentListings, deleteAgentListing } = agentStore();
  const user = auth?.user;

  useEffect(() => {
    const roles = auth?.roles;
    if (!roles || !roles.includes("Agent")) {
      navigate("/");
    }
    
    if (user) {
      document.title = `${user.firstName}'s Listings - RealState App`;
      fetchAgentListings(user.id);
    }

  }, [auth?.user?.id]);

  const handleDeleteListing = async (id: number) => {
    await deleteAgentListing(id);
    listings.filter(listing => listing.id !== id);
    console.log(`Delete listing with ID: ${id}`);
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Your Listings</h1>
        <Link to="/create-listing" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
          Add Listing
        </Link>
      </div>

      {/* Mobile Cards (visible on small screens) */}
      <div className="md:hidden space-y-4">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="font-medium text-gray-900 text-sm mb-2">{listing.description}</h3>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.isAvailable)}`}>
                  {listing.isAvailable ? 'Available' : 'Not Available'}
                </span>
                <span className="text-sm text-gray-600">{listing.offers.length} offers</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="text-blue-600 hover:text-blue-800">View Offers</button>
              <span className="text-gray-300">|</span>
              <Link to={`/manage-listing/${listing.id}`} className="text-blue-600 hover:text-blue-800">Edit</Link>
              <span className="text-gray-300">|</span>
              <button onClick={() => handleDeleteListing(listing.id)} className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (hidden on small screens) */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm lg:text-base">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm lg:text-base">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm lg:text-base">Offers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm lg:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, index) => (
                <tr key={listing.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4 text-gray-900 text-sm lg:text-base">
                    <div className="max-w-xs lg:max-w-none truncate">{listing.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${getStatusColor(listing.isAvailable)}`}>
                      {listing.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900 text-center text-sm lg:text-base">{listing.offers.length}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-1 lg:space-y-0 text-xs lg:text-sm">
                      <button className="text-blue-600 hover:text-blue-800 text-left">View Offers</button>
                      <span className="text-gray-300 hidden lg:inline">|</span>
                      <Link to={`/manage-listing/${listing.id}`} className="text-blue-600 hover:text-blue-800 text-left">Edit</Link>
                      <span className="text-gray-300 hidden lg:inline">|</span>
                      <button onClick={() => handleDeleteListing(listing.id)} className="text-red-600 hover:text-red-800 text-left">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Listings