import ListHouseContainer from '@/components/Signup/ListHouseContainer'
import useTitle from '@/hooks/useTitle'
import { useEffect } from 'react'
import { propertyStore } from '@/store/PropertyStore'
import Property from '@/components/Home/Property'

function HomePage() {
  const {fetchProperties, properties } = propertyStore()
  useEffect(() => {
     fetchProperties()
  }, [])

  useTitle('Real State App - Home Page')
  return (
    <div className='w-full'>        
      <h1 className="text-2xl font-bold mb-6">Homes for you</h1>
      <ListHouseContainer>
        {properties.map((property) => (
          <Property key={property.id} {...property} />
        ))}
      </ListHouseContainer>
      
    </div>
  )
}

export default HomePage
