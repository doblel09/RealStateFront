import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
    <Header />
      <main className="px-5 lg:px-[160px] flex min-h-screen mb-10 md:pt-10 pt-4 justify-center">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
