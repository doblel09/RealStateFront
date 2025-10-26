import { useSearchParams, Link } from "react-router-dom"
import HeartIcon from '@/assets/like.svg'
import { propertyStore } from "@/store/PropertyStore";
import { useEffect, useState } from "react";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import { useAuth } from "@/hooks/useAuth";
import ImageModal from "@/components/ImageModal";

const Details = () => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("id");
  const { fetchPropertyById, property } = propertyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const auth = useAuth();
  const roles = auth?.roles;
  const user = auth?.user; // Añadir user para comparar con agentId

  useEffect(() => {
    if (propertyId) {
      fetchPropertyById(parseInt(propertyId));
    }
  }, [propertyId, fetchPropertyById]);


  return (
    property ? (
      <div className="container flex flex-col gap-5 max-w-[928px]">
        <div className="w-full h-[400px] rounded-lg cursor-pointer hover:opacity-90" onClick={() => setIsModalOpen(true)}>
          <ImageSlider
            images={property.images}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          />
        </div>
        {property?.images?.length > 0 && (
          <ImageModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            images={property?.images || []}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
          />
        )}
        <div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-xl">{property.propertyType?.name} - {property.uniqueCode}</p>
            <button className="p-2 bg-[#EBF2E8] hover:bg-gray-100 rounded-full transition-colors">
              <img src={HeartIcon} alt="Like" className="w-6 h-6 " />
            </button>
          </div>
          <p className="text-base">{property.description}</p>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">Property Details</h1>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border-t border-b border-gray-300 py-2 w-1/2">
                  <div className="text-base font-medium">Size</div>
                  <div className="text-base font-light">{property.sizeInSquareMeters} m²</div>
                </td>
                {property.roomCount > 0 && (
                  <td className="border-t border-b border-gray-300 py-2 w-1/2">
                    <div className="text-base font-medium">Rooms</div>
                    <div className="text-base font-light">{property.roomCount} Rooms</div>
                  </td>
                )}
              </tr>
              <tr>
                {property.bathroomCount > 0 && (
                  <td className="border-t border-b border-gray-300 py-2 w-1/2">
                    <div className="text-base font-medium">Bathrooms</div>
                    <div className="text-base font-light">{property.bathroomCount} Bathrooms</div>
                  </td>
                )}
                <td className="border-t border-b border-gray-300 py-2 w-1/2">
                  <div className="text-base font-medium">Sale type</div>
                  <div className="text-base font-light">{property.saleType?.name}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">What this place offers</h1>
          <ul className="grid grid-cols-2 gap-4">
            {property.improvements?.map((improvement) => (
              <li key={improvement.id} className="text-base">{improvement.name}</li>
            ))}
          </ul>
        </div>
        <h1 className="text-2xl font-bold mb-4">Offers</h1>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          {property.offers?.length === 0 ? (
            <p className="text-center py-4">No offers available</p>
          ) : (
            <table className="text-base w-full">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Offer Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {property.offers?.map((offer) => (
                  <tr key={offer.id}>
                    <td className="py-4 px-4">{offer.clientName}</td>
                    <td className="py-4 px-4">{offer.amount} USD</td>
                    <td className="py-4 px-4">{offer.status}</td>
                    <td className="py-4 px-4">{new Date(offer.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Botones condicionales */}
        <div className="flex gap-4 mt-4">
          {/* Botón para customers */}
          {roles?.includes('Customer') && (
            <button className="bg-[#619154] text-white px-4 py-2 mx-auto lg:mx-0 w-1/4 md:w-1/4 rounded-lg hover:bg-[#5a8b4c]">
              Make an Offer
            </button>
          )}

          {/* Botón para el agente propietario */}
          {user?.id && property.agentId === user.id && (
            <Link
              to={`/manage-listing/${property.id}`}
              className="bg-blue-600 text-white px-4 py-2 mx-auto lg:mx-0 w-1/4 md:w-1/4 rounded-lg hover:bg-blue-700 text-center transition-colors"
            >
              Edit Listing
            </Link>
          )}
        </div>
      </div>
    ) : (
      <div>
        <h1>Property not found</h1>
      </div>
    )
  );
}

export default Details
