import LandscapePlaceholder from '@/assets/landscape-placeholder.svg'
import type { PropertyType } from '@/type/types';
import { Link } from 'react-router-dom';

const GetPropertyDetails = ({
    roomCount,
    sizeInSquareMeters,
    bathroomCount,
}: {
    roomCount?: number;
    sizeInSquareMeters?: number;
    bathroomCount?: number;
}): string => {
    let details = "";
    roomCount && (details += `${roomCount} Rooms · `);
    bathroomCount && (details += `${bathroomCount} Bathrooms · `);
    sizeInSquareMeters && (details += `${sizeInSquareMeters} m²`);
    return details;
};

const Property = ({ id, uniqueCode, price, sizeInSquareMeters, roomCount, bathroomCount, images, propertyType, saleType }: PropertyType) => {
    const formatCurrency = (amount: number, locale = 'en-US', currency = 'USD') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
        };

    const mainImage = images?.[0] ? import.meta.env.VITE_BACKEND_BASE_URL + images?.[0] : LandscapePlaceholder;

  return (
    
      <div className="bg-white shadow-md md:shadow-none overflow-hidden flex flex-col rounded-xl md:rounded-none md:flex-row md:justify-between md:my-4">

        <Link to={`/details?id=${id}`}>
        <div className='flex flex-col gap-1 order-1 p-4 md:pt-12'>
            <p className="text-base text-[#639154]">{saleType?.description} - {uniqueCode}</p>
            <p className="font-bold text-xl">{propertyType?.name} - {formatCurrency(price)} USD</p>
            <p className="text-base text-[#639154]">{GetPropertyDetails({ roomCount, sizeInSquareMeters, bathroomCount })}</p>
          </div>
        </Link>
        <Link className='order-first md:order-2' to={`/details?id=${id}`}><img src={mainImage} alt="Property Image" className="h-48 w-full md:w-[320px] md:h-[171px] object-cover overflow-hidden" /></Link>

    </div>
    
  )
}

export default Property
