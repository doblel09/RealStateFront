import { Link, useParams } from "react-router-dom"
import ListHouseContainer from "@/components/Signup/ListHouseContainer";
import Property from "@/components/Home/Property";
import { agentStore } from "@/store/AgentStore";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import PersonLogo from '@/assets/person-button.svg';

const Agent = () => {
  const { id } = useParams();
  const { agent, fetchAgentById } = agentStore();
  const auth = useAuth();
  const user = auth?.user;

  useEffect(() => {
    if (id) {
      fetchAgentById(id);
    }
  }, [id]);

  const getProfilePicture = (picture: string | null) => {
    if (picture) {
      return import.meta.env.VITE_BACKEND_BASE_URL + picture;
    }
    return PersonLogo;
  };

  return (
    id ? (
      <div className="container flex flex-col gap-5 max-w-[928px]">
        {/* Agent Header */}
        <div className="p-6 text-center">
          {/* Agent Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-[#D4B5A0] rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-[#C4A484] rounded-full flex items-center justify-center">
                <img src={getProfilePicture(agent?.profilePicture || null)} alt="Agent Avatar" className="w-16 h-16 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Agent Name */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">{agent?.firstName} {agent?.lastName}</h2>

          {/* Agent Title */}
          <p className="text-[#668A5C] text-sm mb-2">Real Estate Agent</p>
          
          {/* Agent Contact */}
          <p className="text-[#668A5C] text-sm mb-6">
            {agent?.email} · {agent?.phone}
          </p>
          
          {/* Properties Count */}
          <div className="border border-[#D6E3D4] w-full rounded-lg py-4 px-6 inline-block">
            <div className="text-2xl font-bold text-gray-900">{agent?.propertyCount}</div>
            <div className="text-[#668A5C] text-sm">Properties</div>
          </div>
        </div>
        {/* Botón Manage my account - Solo si es el mismo usuario */}
        {user?.id && agent?.id && user.id === agent.id && (
          <div className="flex justify-center mt-4">
            <Link to="/manage-account" className="bg-[#619154] text-white px-6 py-2 rounded-lg hover:bg-[#5a8b4c] transition-colors">
              Manage my account
            </Link>
          </div>
        )}

        <h1 className="text-2xl font-bold">Properties</h1>
        <ListHouseContainer>
          {agent?.properties?.map((property) => (
            <Property key={property.id} {...property} />
          ))}
        </ListHouseContainer>

        
      </div>
    ) : (
      <div>
        <h1>Agent not found</h1>
      </div>
    )
  );
}

export default Agent
