import { Axios } from '@/helpers'
import AppViews from '~/routes/app'
import { AuthLayout } from '~/layouts'
import DeveloperViews from '~/routes/developer'
import { Root, Errors } from '@/components/app'
import { createBrowserRouter, Outlet, redirect } from 'react-router-dom'

export default createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Errors />,
    children: [
      {
        path: '',
        element: <AppViews.Auth.Login />,
      },
      {
        path: 'app',
        element: <AuthLayout />,
        shouldRevalidate: () => true,
        loader: async () => {

          const { data } = await Axios().get('auth')

          return data?.id === undefined ? redirect('/') : data

        },

        children: [
          {
            path: 'dashboard',
            element: <AppViews.Dashboard />
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
                element: <AppViews.Users.List />,
              },
              {
                path: 'create',
                element: <AppViews.Users.Create />,
              },
              {
                path: ':id/edit',
                element: <AppViews.Users.Edit />,
                loader: async ({ params }) => Axios().get(`/users/${params.id}/edit`).then(({ data }) => data).catch(({ response }) => response)
              },
              {
                path: ':id',
                element: <AppViews.Users.Show />,
              },
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
                element: <AppViews.Categories.List />,
              },

              {
                path: 'create',
                element: <AppViews.Categories.Create />,
                loader: async () => Axios().get('categories/create').then(({ data }) => data),
              },

              {
                path: ':id',
                element: <AppViews.Categories.Show />,
                loader: async ({ params }) => Axios().get(`categories/${params.id}`).then(({ data }) => data),
              },
              {
                path: ':id/edit',
                element: <AppViews.Categories.Edit />,
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
                element: <AppViews.Reviews.List />
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
                element: <AppViews.Ingredients.List />
              },
              {
                path: 'create',
                element: <AppViews.Ingredients.Create />,
                loader: async () => Axios().get(`/ingredients/create`).then(({ data }) => data)
              },
              {
                path: ':id',
                element: <AppViews.Ingredients.Show />,
                loader: async ({ params }) => Axios().get(`/ingredients/${params.id}`).then(({ data }) => data)
              },
              {
                path: ':id/edit',
                element: <AppViews.Ingredients.Edit />,
                loader: async ({ params }) => Axios().get(`/ingredients/${params.id}/edit`).then(({ data }) => data)
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
                element: <AppViews.Cuisines.List />
              },
              {
                path: 'create',
                element: <AppViews.Cuisines.Create />
              },
              {
                path: ':id',
                element: <AppViews.Cuisines.Show />,
                loader: async ({ params }) => Axios().get(`/cuisines/${params.id}`).then(({ data }) => data)
              },
              {
                path: ':id/edit',
                element: <AppViews.Cuisines.Edit />,
                loader: async ({ params }) => Axios().get(`/cuisines/${params.id}/edit`).then(({ data }) => data)
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
                element: <AppViews.Subscriptions.List />
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
                element: <AppViews.Orders.List />,
              },
              {
                path: 'create',
                element: <AppViews.Orders.Create />,
              },
              {
                path: ':id/edit',
                element: <AppViews.Orders.Edit />,
              },
              {
                path: ':id',
                element: <AppViews.Orders.Show />,
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
                element: <AppViews.Chat.List />
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
                element: <AppViews.Products.List />
              },
              {
                path: ':id',
                element: <AppViews.Products.Show />,
                loader: async ({ params }) => Axios().get(`/products/${params.id}`).then(({ data }) => data).catch(({ response }) => { throw new Response(response) })
              },
              {
                path: ':id/edit',
                element: <AppViews.Products.Edit />,
                loader: async ({ params }) => Axios().get(`/products/${params.id}/edit`).then(({ data }) => data)
              },
              {
                path: 'create',
                element: <AppViews.Products.Create />,
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
                element: <AppViews.Clients.List />
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
                element: <AppViews.Banners.List />
              },
              {
                path: 'create',
                element: <AppViews.Banners.Create />
              },
              {
                path: ':id/edit',
                element: <AppViews.Banners.Edit />
              },
              {
                path: ':id',
                element: <AppViews.Banners.Show />
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
                element: <AppViews.Pages.List />
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
                element: <AppViews.Feedbacks.List />
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
                element: <AppViews.WonderPoints.List />
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
                element: <AppViews.Coupons.List />
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
                element: <AppViews.Reservations.List />
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
                element: <AppViews.WaitList.List />
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
                element: <AppViews.Settings.List />
              }
            ]
          },
        ]
      },
      {
        path: 'developer',
        element: <AuthLayout />,
        shouldRevalidate: () => true,
        loader: async () => {

          const { data } = await Axios().get('auth')

          return data?.id === undefined ? redirect('/') : data

        },
        children: [
          {
            path: 'dashboard',
            element: <DeveloperViews.Dashboard />
          }
        ]
      }
    ]
  }
])
