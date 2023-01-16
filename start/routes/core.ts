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
  }).middleware('api.core.auth')

  /**
   * Routes for all users.
   */
  Route.get('auth', 'UserController').as('user')
}).prefix('/core').as('core').namespace('App/Controllers/Http/Core')
