
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'Admin/HomeController.show')

  Route.resource('testimonials', 'Admin/TestimonialsController')

  Route.resource('cuisines', 'Admin/CuisinesController')

  Route.resource('categories', 'Admin/CategoriesController')
  Route.resource('products', 'Admin/ProductsController')
  Route.resource('ingridients', 'Admin/IngridientsController')
  Route.resource('banners', 'Admin/BannersController')
  Route.resource('media', 'Admin/MediaController')
  Route.resource('users', 'Admin/UsersController')
}).middleware('auth')
