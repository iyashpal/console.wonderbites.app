
import Route from '@ioc:Adonis/Core/Route'

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
  Route.resource('media', 'MediaController')
  Route.resource('review', 'ReviewController')
  Route.resource('users', 'UsersController')
  Route.resource('orders', 'OrdersController')
}).middleware('auth').namespace('App/Controllers/Http/Admin')
