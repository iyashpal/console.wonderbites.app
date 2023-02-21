import Route from '@ioc:Adonis/Core/Route'

/**
 * Root group for Core API Routes
 */
Route.group(() => {
  /**
   * Routes for Guest users.
   */
  Route.group(() => {
    Route.post('login', 'LoginController').as('login')
  }).middleware('api.guest')

  /**
   * Routes for Authenticated users.
   */
  Route.group(() => {
    Route.post('logout', 'LogoutController').as('logout')

    Route.resource('cuisines', 'CuisinesController')

    Route.resource('products', 'ProductsController').apiOnly()

    Route.resource('categories', 'CategoriesController').apiOnly()

    Route.resource('ingredients', 'IngredientsController').apiOnly()
  }).middleware('api.core.auth')

  /**
   * Routes for all users.
   */
  Route.get('auth', 'AuthController').as('auth')
}).prefix('/core').as('core').namespace('App/Controllers/Http/Core')
