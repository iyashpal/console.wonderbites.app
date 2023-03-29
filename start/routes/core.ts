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

    // Resource routes
    Route.resource('cuisines', 'CuisinesController')
    Route.resource('products', 'ProductsController')
    Route.resource('categories', 'CategoriesController')
    Route.resource('ingredients', 'IngredientsController')

    // Pivot Routes
    Route.group(() => {
      Route.resource('products.media', 'MediaProductController').apiOnly()
    }).as('pivot').namespace('App/Controllers/Http/Core/Pivot')

    // Actions Routes
    Route.group(() => {
      Route.post('products/:id/ingredient', 'IngredientProductController').as('ingredient.product')
      Route.post('cuisines/:id/categories', 'CategoryCuisineController').as('category.cuisine')
    }).as('actions').namespace('App/Controllers/Http/Core/Actions')
  }).middleware('api.core.auth')

  // General Routes
  Route.get('auth', 'AuthController').as('auth')
}).prefix('/core').as('core').namespace('App/Controllers/Http/Core')
