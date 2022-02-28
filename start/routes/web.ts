
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get('/', 'Admin/HomeController.show')

    Route.resource('testimonials', 'Admin/TestimonialsController');

    Route.resource('cuisines', 'Admin/CuisinesController');

    Route.resource('categories', 'Admin/CategoriesController');

    Route.resource('users', 'Admin/UsersController');

}).middleware('auth')
