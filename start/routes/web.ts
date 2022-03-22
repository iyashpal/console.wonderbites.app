
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'Admin/HomeController.show')
  Route.resource('testimonials', 'Admin/TestimonialsController')
  Route.resource('cuisines', 'Admin/CuisinesController')
  Route.resource('categories', 'Admin/CategoriesController')

  Route.resource('products', 'Admin/ProductsController')
  Route.post('products/:id/category', 'Admin/ProductsController.toggleCategory').as('products.category')

  Route.resource('ingridients', 'Admin/IngridientsController')
  Route.resource('banners', 'Admin/BannersController')
  Route.resource('media', 'Admin/MediaController')
  Route.resource('review', 'Admin/ReviewController')
  Route.resource('users', 'Admin/UsersController')
  Route.resource('orders', 'Admin/OrdersController')
  Route.resource('teams', 'Admin/TeamsController')
  Route.resource('careercategories', 'Admin/CareerCategoriesController')
  Route.resource('brands', 'Admin/BrandsController')
  Route.resource('categoryblog', 'Admin/CategoryBlogsController')
  Route.resource('blogs', 'Admin/BlogsController')
}).middleware('auth')
