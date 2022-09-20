import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
   * Routes that allowed only for a logged-in user.
   */
  Route.group(() => {
    // Get the authenticated user.
    Route.get('users/auth', 'UsersController.auth').as('users.auth')

    // Endpoints to user operations.
    Route.resource('users', 'UsersController').apiOnly().only(['update', 'show'])

    // Resources endpoints to user addresses.
    Route.resource('addresses', 'AddressesController')

    Route.route('checkouts', ['POST', 'PUT', 'PATCH'], 'CheckoutsController.process').as('checkouts.process')

    // Endpoint to create user orders.
    Route.resource('orders', 'OrdersController').apiOnly().only(['index', 'show'])

    Route.resource('reviews', 'ReviewsController').apiOnly().only(['store'])

    // Endpoint to create wishlists.
    Route.get('wishlists', 'WishlistsController.show').as('wishlists.show')
    Route.put('wishlists', 'WishlistsController.update').as('wishlists.update')

    Route.post('products/:id/category', 'ProductsController.toggleCategory').as('products.category')

    // Endpoints to Wonderpoints
    Route.resource('wonderpoints', 'WonderpointsController').apiOnly().only(['index', 'store'])
    Route.get('wonderpoints/avail', 'WonderpointsController.availWonderpoints').as('wonderpoints.avail')
  }).middleware('api.auth')

  /**
   * Routes that allowed for everyone (guest|logged in) users.
   */
  Route.group(() => {
    Route.resource('reviews', 'ReviewsController').apiOnly().only(['index', 'show'])
    // Endpoints for cart.
    Route.get('cart', 'CartsController.show').as('carts.show')
    Route.route('cart', ['PUT', 'Patch'], 'CartsController.update').as('carts.update')

    // Apply coupon to a checkout
    Route.post('coupons/apply', 'CouponsController.apply').as('coupons.apply')
    Route.post('coupons/remove', 'CouponsController.remove').as('coupons.remove')

    // Cart coupons endpoints.
    Route.resource('coupons', 'CouponsController').apiOnly().middleware({ '*': ['api.auth'] })

    Route.resource('categories', 'CategoriesController')

    Route.resource('cuisines', 'CuisinesController').apiOnly().only(['index', 'show'])

    //Route.resource('blogs', 'BlogsController').as('blogs')
    Route.get('blogs', 'BlogsController.index').as('blogs')

    Route.get('blogs/:slug', 'BlogsController.showBlogBySlug').as('blogslug')

    //Route.resource('blogs', 'BlogsController').as('blogs')

    Route.resource('testimonials', 'TestimonialsController').as('testimonials')

    Route.resource('banners', 'BannersController')

    Route.resource('teams', 'TeamsController').as('teams')

    Route.get('about', 'HomeController.about').as('about')

    Route.resource('products', 'ProductsController')

    Route.get('getcart', 'CartsController.getcart').as('getcart')

    Route.get('terms', 'HomeController.terms').as('terms')

    Route.get('privacy_policy', 'HomeController.privacy_policy').as('privacy_policy')

    Route.get('content_policy', 'HomeController.content_policy').as('content_policy')

    Route.get('settings', 'HomeController.settings').as('settings')

    Route.get('my_subscriptions', 'HomeController.my_subscriptions').as('my_subscriptions')

    Route.post('job-apply', 'JobApplicationsController.apply').as('jobapply')

    Route.post('contacts', 'ContactsController.send').as('contacts')
  })
}).prefix('/api').as('api').namespace('App/Controllers/Http/API')
