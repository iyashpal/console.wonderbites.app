
import Route from '@ioc:Adonis/Core/Route'

Route.get('inertia-js', async ({inertia}) => {
  return inertia.render('Testing')
})
/**
 * Admin Routes
 */
Route.group(() => {
  Route.get('/', 'HomeController.show')
  Route.resource('testimonials', 'TestimonialsController')
  Route.resource('cuisines', 'CuisinesController')
  Route.resource('categories', 'CategoriesController')
  Route.resource('products', 'ProductsController')
  Route.post('products/:id/category', 'CategoriesController.toggleCategory').as('products.category')

  Route.post('category/:id/cuisine', 'CategoriesController.toggleCuisine').as('category.cuisine')

  Route.post('products/:id/media', 'ProductsController.handleMedia').as('products.media')
  Route.resource('coupons', 'CouponsController')
  Route.resource('ingridients', 'IngridientsController')
  Route.resource('banners', 'BannersController')
  Route.resource('media', 'MediaController')
  Route.resource('review', 'ReviewController')
  Route.resource('users', 'UsersController')
  Route.resource('orders', 'OrdersController')
  Route.resource('teams', 'TeamsController')
  Route.resource('careercategories', 'CareerCategoriesController')
  Route.resource('brands', 'BrandsController')
  Route.resource('blogs', 'BlogsController')
  Route.post('blogs/:id/category', 'BlogsController.toggleCategory').as('blogs.category')
  Route.resource('openingpositions', 'OpeningPositionsController')
  Route.post('openingpositions/:id/category', 'OpeningPositionsController.toggleCategory').as('opening.category')
  Route.resource('jobapplications', 'JobApplicationsController')
  Route.resource('contacts', 'ContactsController')
}).middleware('auth').namespace('App/Controllers/Http/Admin')
