
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', ({ view }) => view.render('welcome'))
