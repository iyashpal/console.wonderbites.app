import { Axios } from '@/helpers'
import Views from '@/routes/views'
import { AuthLayout } from '~/layouts'
import { createBrowserRouter, Outlet, redirect } from 'react-router-dom'

export const AppRoutes = [
  {
    path: '/',
    element: <Views.Auth.Login />
  },

  {
    path: '/app',
    element: <AuthLayout />,
    shouldRevalidate: () => true,
    loader: async () => {

      const { data } = await Axios().get('auth')

      return data?.id === undefined ? redirect('/') : data

    },

    children: [
      {
        path: 'dashboard',
        element: <Views.Dashboard />
      },

      /**
       * Users Routes
       */
      {
        path: 'users',
        element: <Outlet />,
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
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Views.Categories.List />,
            loader: async () => Axios().get('/categories').then(({ data }) => data),
          },

          {
            path: 'create',
            element: <Views.Categories.Create />,
            loader: async () => Axios().get('categories/create').then(({ data }) => data),
          },

          {
            path: ':id',
            element: <Views.Categories.Show />,
            loader: async ({ params }) => Axios().get(`categories/${params.id}`).then(({ data }) => data),
          },
          {
            path: ':id/edit',
            element: <Views.Categories.Edit />,
            loader: async ({ params }) => Axios().get(`categories/${params.id}/edit`).then(({ data }) => data)
          }
        ]
      },

      /**
       * Reviews Routes
       */
      {
        path: 'reviews',
        element: <Outlet />,
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
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Views.Ingredients.List />
          },
          {
            path: 'create',
            element: <Views.Ingredients.Create />
          },
          {
            path: ':id/update',
            element: <Views.Ingredients.Update />
          },
        ]
      },

      /**
       * Cuisines Routes
       */
      {
        path: 'cuisines',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Views.Cuisines.List />
          },
          {
            path: 'create',
            element: <Views.Cuisines.Create />
          },
          {
            path: ':id',
            element: <Views.Cuisines.Show />,
            loader: async ({ params }) => Axios().get(`/cuisines/${params.id}`).then(({ data }) => data)
          },
          {
            path: ':id/edit',
            element: <Views.Cuisines.Edit />
          }
        ]
      },

      /**
       * Subscriptions Routes
       */
      {
        path: 'subscriptions',
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Views.Products.List />
          },
          {
            path: ':id',
            element: <Views.Products.Show />
          },
          {
            path: ':id/edit',
            element: <Views.Products.Edit />,
            loader: async ({ params }) => Axios().get(`/products/${params.id}/edit`).then(({ data }) => data)
          },
          {
            path: 'create',
            element: <Views.Products.Create />,
            loader: async () => Axios().get(`/products/create`).then(({ data }) => data)
          }
        ]
      },

      /**
       * Clients Routes
       */
      {
        path: 'clients',
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
        element: <Outlet />,
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
