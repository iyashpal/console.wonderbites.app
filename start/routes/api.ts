import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
   * Routes that allowed only for a logged in user.
   */
  Route.group(() => {
    // Get the authenticated user.
    Route.get('auth/user', 'UsersController.user').as('auth.user')

    // Endpoints to user operations.
    Route.resource('users', 'UsersController').apiOnly().only(['update', 'show'])

    // Resources endpoints to user addresses.
    Route.resource('addresses', 'AddressesController')

    // Endpoint to create user orders.
    Route.resource('orders', 'OrdersController').apiOnly().only(['store'])

    // Endpoint to create wishlists.
    Route.get('wishlists', 'WishlistsController.show').as('wishlists.show')
    Route.put('wishlists', 'WishlistsController.update').as('wishlists.update')

    Route.post('products/:id/category', 'ProductsController.toggleCategory').as('products.category')
    // Endpoints to Wonderpoints routes
    Route.group(() => {
      Route.get('wonderpoints', 'WonderpointsController.index').as('index')
      Route.post('wonderpoints', 'WonderpointsController.store').as('store')
      Route.get('wonderpoints/avail', 'WonderpointsController.availWonderpoints').as('avail')
    }).as('wonderpoints')

    // Cart coupons endpoints.
    Route.resource('coupons', 'CouponsController').apiOnly()
  }).middleware('api.auth')

  /**
   * Routes that allowed for everyone (guest|logged in) users.
   */
  Route.group(() => {
    // Endpoints for cart.
    Route.get('cart', 'CartsController.show').as('carts.show')
    Route.put('cart', 'CartsController.update').as('carts.update')

    Route.post('coupons/apply', 'CouponsController.apply').as('coupons.apply')

    Route.resource('cuisines', 'CuisinesController')

    //Route.resource('blogs', 'BlogsController').as('blogs')
    Route.get('blogs', 'BlogsController.index').as('blogs')

    Route.get('blogs/:slug', 'BlogsController.showBlogBySlug').as('blogslug')

    Route.resource('categoryblog', 'CategoryBlogController').as('categoryblog')

    //Route.resource('blogs', 'BlogsController').as('blogs')

    Route.resource('categories', 'CategoriesController')

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
