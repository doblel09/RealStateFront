import type { ReactNode } from 'react';

interface ListHouseContainerProps {
  children: ReactNode;
}

const ListHouseContainer = ({ children }: ListHouseContainerProps) => {
  return (
    <div className='flex flex-col gap-8 mt-6 md:gap-0'>
      {children}
    </div>
  )
}

export default ListHouseContainer
