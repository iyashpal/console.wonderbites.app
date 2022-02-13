

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {

    Route.resource('testimonials', 'TestimonialsController');

}).prefix('/api').as('api')
