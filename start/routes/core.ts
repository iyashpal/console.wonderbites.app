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
    Route.resource('users', 'UsersController')
    Route.resource('orders', 'OrdersController')
    Route.resource('banners', 'BannersController')
    Route.resource('products', 'ProductsController')
    Route.resource('variants', 'VariantsController')
    Route.resource('cuisines', 'CuisinesController')
    Route.resource('attributes', 'AttributesController')
    Route.resource('categories', 'CategoriesController')
    Route.resource('ingredients', 'IngredientsController')
    Route.resource('variants.categories', 'Variants/CategoriesController')

    // Pivot Routes
    Route.group(() => {
      Route.resource('products.media', 'MediaProductController').apiOnly()
      Route.resource('ingredients.variant', 'IngredientVariantController').apiOnly()
    }).as('pivot').namespace('App/Controllers/Http/Core/Pivot')

    // Actions Routes
    Route.group(() => {
      Route.post('categories/:id/extras', 'CategoryExtrasController').as('categories.extras')
      Route.post('products/:id/ingredient', 'IngredientProductController').as('ingredient.product')
      Route.post('cuisines/:id/categories', 'CategoryCuisineController').as('category.cuisine')
    }).as('actions').namespace('App/Controllers/Http/Core/Actions')
  }).middleware('api.core.auth')

  // General Routes
  Route.get('auth', 'AuthController').as('auth')
}).prefix('/core').as('core').namespace('App/Controllers/Http/Core')
