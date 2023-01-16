import {AuthLayout} from '~/layouts';
import * as Views from '@/routes/views'
import {createBrowserRouter} from 'react-router-dom'

export const AppRoutes = [
  {
    path: '/',
    element: <Views.IndexView/>
  },

  {
    path: '/app',
    element: <AuthLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Views.DashboardView/>
      },
    ]
  },

  {
    path: '/about',
    element: <div>This is about page.</div>
  }
]

export default createBrowserRouter(AppRoutes)
