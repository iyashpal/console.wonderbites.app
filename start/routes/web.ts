
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get('/', 'Admin/HomeController.show')

}).middleware('auth')
