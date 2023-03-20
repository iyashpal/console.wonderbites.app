import '@/config'
import React from 'react'
import Store from '@/store'
import '@/styles/global.scss'
import Routes from '@/routes'
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {NotificationsProvider} from "@/components/notifications";

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={Store}>
      <RouterProvider router={Routes}/>
      <NotificationsProvider/>
    </Provider>
  </React.StrictMode>
)
