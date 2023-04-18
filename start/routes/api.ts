import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
   * Routes that allowed only for guest users.
   */
  Route.group(() => {
    Route.post('/mobile/login', 'Auth/MobileLoginsController').as('mobile.login')
    Route.post('/login', 'LoginController').as('login')

    Route.post('/register', 'RegisterController').as('register')

    Route.post('/forgot-password', 'PasswordResetLinkController').as('password.email')

    Route.get('/reset-password/:token', 'Auth/NewPasswordController.create').as('password.reset')
  }).middleware('api.guest')

  /**
   * Routes that allowed only for a logged-in user.
   */
  Route.group(() => {
    Route.post('/logout', 'LogoutController').as('logout')

    // Get the authenticated user.
    Route.get('users/auth', 'UsersController.auth').as('users.auth')

    // Add or remove the user avatar.
    Route.put('users/avatar', 'UsersController.avatar').as('users.avatar')

    // Endpoints to user operations.
    Route.resource('users', 'UsersController').apiOnly().only(['update', 'show'])

    // User notifications endpoints
    Route.resource('notifications', 'NotificationsController').apiOnly().only(['index', 'update'])

    // Resources endpoints to user addresses.
    Route.resource('addresses', 'AddressesController').apiOnly()

    // Endpoint to create user orders.
    Route.resource('orders', 'OrdersController').apiOnly().only(['index', 'show'])
    Route.put('orders/:id/cancel', 'OrdersController.cancel').as('orders.cancel')

    Route.resource('reviews', 'ReviewsController').apiOnly().only(['store', 'update'])

    // Endpoint to create wishlists.
    Route.get('wishlists', 'WishlistsController.show').as('wishlists.show')
    Route.put('wishlists', 'WishlistsController.update').as('wishlists.update')
    Route.post('wishlists/clean', 'WishlistsController.clean').as('wishlists.clean')

    Route.post('products/:id/category', 'ProductsController.toggleCategory').as('products.category')

    // Endpoints to Wonderpoints
    Route.resource('wonderpoints', 'WonderpointsController').apiOnly().only(['index', 'store'])
    Route.get('wonderpoints/avail', 'WonderpointsController.availWonderpoints').as('wonderpoints.avail')

    Route.resource('feedbacks', 'FeedbacksController').apiOnly()
  }).middleware('api.auth')

  /**
   * Routes that allowed for everyone (guest|logged in) users.
   */
  Route.group(() => {
    Route.resource('reviews', 'ReviewsController').apiOnly().only(['index', 'show'])
    // Endpoints for cart.
    Route.get('cart', 'CartsController.show').as('carts.show')
    Route.route('cart', ['PUT', 'PATCH'], 'CartsController.update').as('carts.update')
    Route.route('cart/quick', ['PUT', 'PATCH'], 'CartsController.quick').as('carts.quick')

    // Cart coupons endpoints.
    Route.post('coupons/apply', 'CouponsController.apply').as('coupons.apply')
    Route.post('coupons/remove', 'CouponsController.remove').as('coupons.remove')
    Route.resource('coupons', 'CouponsController').apiOnly().middleware({ '*': ['api.auth'] })

    Route.resource('categories', 'CategoriesController').apiOnly()

    Route.resource('cuisines', 'CuisinesController').apiOnly().only(['index', 'show'])

    Route.resource('testimonials', 'TestimonialsController').apiOnly()

    Route.resource('products', 'ProductsController').apiOnly()

    Route.resource('advertisements', 'AdvertisementsController').apiOnly().only(['index', 'show'])
    Route.resource('banners', 'BannersController').apiOnly().only(['index', 'show'])

    Route.route('checkouts', ['POST', 'PUT', 'PATCH'], 'CheckoutsController.process').as('checkouts.process')
  })

  /**
   * Routes that are statically setup.
   */
  Route.group(() => {
    Route.get('about', 'StaticsController.about').as('about')

    Route.get('privacy-policy', 'StaticsController.privacyPolicy').as('privacyPolicy')

    Route.get('content-policy', 'StaticsController.contentPolicy').as('contentPolicy')

    Route.get('terms-of-services', 'StaticsController.termsOfServices').as('termsOfServices')
  }).prefix('/static').as('static')
}).prefix('/api').as('api').namespace('App/Controllers/Http/API')
