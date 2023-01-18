import {useAuth} from '~/hooks'
import {useEffect, useState} from 'react'
import {Header, Sidebar} from './AuthLayout/index'
import {Outlet, useNavigate} from 'react-router-dom'

export default function AuthLayout() {
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

          <main className="flex-1 md:flex relative pt-4">

            <Sidebar show={sidebarOpen} onToggleSidebar={onToggleSidebar}/>

            <div className={'flex-1 max-h-content overflow-y-auto'}>

              <Outlet/>

            </div>

          </main>

        </div>

      </div>
    </>
  )

}

