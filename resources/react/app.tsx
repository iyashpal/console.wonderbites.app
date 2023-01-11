import React from 'react'
import '@/styles/global.scss'
import Routes from '@/routes'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={Routes}/>
  </React.StrictMode>
)
