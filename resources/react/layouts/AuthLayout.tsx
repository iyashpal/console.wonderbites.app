import {useAuth} from '~/hooks'
import {useEffect, useState} from 'react'
import {Header, Sidebar} from './AuthLayout/index'
import {Outlet, useNavigate} from 'react-router-dom'

export default function AuthLayout(props) {
  const auth = useAuth()
  const navigateTo = useNavigate()

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigateTo('/')
    }
  }, [])


  const [sidebarOpen, setSidebarOpen] = useState(false)

  function onToggleSidebar() {
    setSidebarOpen(value => !value)
  }

  return (
    <>
      <div className={'h-screen'}>

        <div className="flex flex-col h-full">
          <Header onToggleSidebar={onToggleSidebar}/>

          <main className="flex-1 grid grid-cols-6 relative pt-4">

            <Sidebar show={sidebarOpen} onToggleSidebar={onToggleSidebar}/>

            <div className={'col-span-5 max-h-content overflow-y-auto'}>
              <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  <Outlet/>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )

}

