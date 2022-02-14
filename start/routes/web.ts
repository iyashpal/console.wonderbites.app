
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get('/', ({ view }) => view.render('welcome'))

}).middleware('auth')
