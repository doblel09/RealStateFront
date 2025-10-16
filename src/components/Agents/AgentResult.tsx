import PersonLogo from '@/assets/person-button.svg';

export type AgentResultProps = {
    id: number;
    name: string;
    phone: string;
    email: string;
    propertyCount?: number;
    picture: string;
}

const AgentResult = ({ id, name, phone, email, propertyCount, picture }: AgentResultProps) => {
    const getProfilePicture = (picture: string) => {
    if (picture) {
        return import.meta.env.VITE_BACKEND_BASE_URL + picture;
    }
    return PersonLogo;
    };

  return (
                <li key={id} className="flex items-center gap-4">
                    <img src={getProfilePicture(picture)} alt={name} className="w-16 h-16 rounded-full" />
                    <div className="flex flex-col">
                        <span className="font-bold">{name}</span>
                        <span className="text-sm text-gray-600">{phone}</span>
                        <span className="text-sm text-gray-600">{email}</span>
                        {propertyCount && (
                            <span className="text-sm text-gray-600">Properties: {propertyCount}</span>
                        )}
                    </div>
                </li>
  )
}

export default AgentResult
