import Views from '@/routes/views'
import {AuthLayout} from '~/layouts'
import {createBrowserRouter, Outlet} from 'react-router-dom'

export const AppRoutes = [
  {
    path: '/',
    element: <Views.Auth.Login/>
  },

  {
    path: '/app',
    element: <AuthLayout/>,
    children: [
      {
        path: 'dashboard',
        element: <Views.Dashboard/>
      },

      /**
       * Users Routes
       */
      {
        path: 'users',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Users.List />
          }
        ]
      },

      /**
       * Categories Routes
       */
      {
        path: 'categories',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Categories.List/>
          },

          {
            path: ':id',
            element: <Views.Categories.Show/>
          }
        ]
      },

      /**
       * Reviews Routes
       */
      {
        path: 'reviews',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Reviews.List />
          }
        ]
      },

      /**
       * Ingredients Routes
       */
      {
        path: 'ingredients',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Ingredients.List />
          }
        ]
      },

      /**
       * Cuisines Routes
       */
      {
        path: 'cuisines',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Cuisines.List/>
          },
          {
            path: ':id',
            element: <Views.Cuisines.Show/>
          }
        ]
      },

      /**
       * Subscriptions Routes
       */
      {
        path: 'subscriptions',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Subscriptions.List />
          }
        ]
      },

      /**
       * Orders Routes
       */
      {
        path: 'orders',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Orders.List />
          }
        ]
      },

      /**
       * Chats Routes
       */
      {
        path: 'chats',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Chat.List />
          }
        ]
      },

      /**
       * Products Routes
       */
      {
        path: 'products',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Products.List/>
          },
          {
            path: ':id',
            element: <Views.Products.Show/>
          },
          {
            path: 'create',
            element: <Views.Products.Create />
          }
        ]
      },

      /**
       * Clients Routes
       */
      {
        path: 'clients',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Clients.List />
          }
        ]
      },

      /**
       * Banners Routes
       */
      {
        path: 'banners',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Banners.List />
          }
        ]
      },

      /**
       * Pages Routes
       */
      {
        path: 'pages',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Pages.List />
          }
        ]
      },

      /**
       * Feedbacks Routes
       */
      {
        path: 'feedbacks',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Feedbacks.List />
          }
        ]
      },

      /**
       * Wonder points Routes
       */
      {
        path: 'wonderpoints',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.WonderPoints.List />
          }
        ]
      },

      /**
       * Coupons Routes
       */
      {
        path: 'coupons',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Coupons.List />
          }
        ]
      },

      /**
       * Reservations Routes
       */
      {
        path: 'reservations',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Reservations.List />
          }
        ]
      },

      /**
       * Wait list routes
       */
      {
        path: 'waitlist',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.WaitList.List />
          }
        ]
      },

      /**
       * Settings Routes
       */
      {
        path: 'settings',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Views.Settings.List />
          }
        ]
      },
    ]
  },

  {
    path: '*',
    element: <Views.Errors.NotFound />
  }
]

export default createBrowserRouter(AppRoutes)
