import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
   * Routes that allowed only for guest users.
   */
  Route.group(() => {
    /**
     * OTP authentication routes.
     */
    Route.group(() => {
      Route.post('login', 'Auth/OTP/LoginController').as('login')
      Route.post('register', 'Auth/OTP/RegisterController').as('register')
      Route.post('generate', 'Auth/OTP/GenerateCodesController').as('generate')
      Route.post('verify/:token', 'Auth/OTP/VerifyCodesController').as('verify')
      Route.post('forgot-password', 'Auth/OTP/ForgotPasswordController').as('forgot-password')
      Route.post('reset-password/:token', 'Auth/OTP/ResetPasswordController').as('reset-password')
    }).as('otp').prefix('otp')

    Route.post('/login', 'Auth/LoginController').as('login')
    Route.post('/register', 'Auth/RegisterController').as('register')
    Route.post('/forgot-password', 'Auth/PasswordResetLinkController').as('password.email')
    Route.get('/reset-password/:token', 'Auth/NewPasswordController.create').as('password.reset')
  }).middleware('api.guest')

  /**
   * Routes that allowed only for a logged-in user.
   */
  Route.group(() => {
    Route.post('/logout', 'Auth/LogoutController').as('logout')
    Route.get('users/auth', 'UsersController.auth').as('users.auth')
    Route.put('users/avatar', 'UsersController.avatar').as('users.avatar')
    Route.resource('users', 'UsersController').apiOnly().only(['update', 'show', 'destroy'])

    Route.resource('notifications', 'NotificationsController').apiOnly().only(['index', 'update'])

    Route.resource('addresses', 'AddressesController').apiOnly()

    Route.resource('orders', 'OrdersController').apiOnly().only(['index', 'show', 'update'])

    Route.resource('reviews', 'ReviewsController').apiOnly().only(['store', 'update'])

    Route.get('wishlists', 'WishlistsController.show').as('wishlists.show')
    Route.put('wishlists', 'WishlistsController.update').as('wishlists.update')
    Route.post('wishlists/clean', 'WishlistsController.clean').as('wishlists.clean')

    Route.post('products/:id/category', 'ProductsController.toggleCategory').as('products.category')

    Route.resource('wonder-points', 'WonderPointsController').apiOnly().only(['index', 'store'])
    Route.get('wonder-points/avail', 'WonderPointsController.availWonderPoints').as('wonder-points.avail')

    Route.resource('feedbacks', 'FeedbacksController').apiOnly()
  }).middleware('api.auth')

  /**
   * Routes that allowed for everyone (guest|logged in) users.
   */
  Route.group(() => {
    Route.resource('reviews', 'ReviewsController').apiOnly().only(['index', 'show'])

    Route.resource('coupons', 'CouponsController').apiOnly().middleware({'*': ['api.auth']})

    Route.resource('categories', 'CategoriesController').apiOnly()

    Route.resource('cuisines', 'CuisinesController').apiOnly().only(['index', 'show'])

    Route.resource('testimonials', 'TestimonialsController').apiOnly()

    Route.resource('products', 'ProductsController').apiOnly()

    Route.resource('banners', 'BannersController').apiOnly().only(['index', 'show'])

    Route.get('carts/:token?/:id?', 'CartsController.show').as('carts.show')
    Route.route('carts/:token?/:id?', ['PUT', 'PATCH'], 'CartsController.update').as('carts.update')
    Route.route('checkouts/:token?/:id?', ['POST', 'PUT', 'PATCH'], 'CheckoutController').as('checkouts.process')

    Route.post('coupons/apply', 'CouponsController.apply').as('coupons.apply')
    Route.post('coupons/remove', 'CouponsController.remove').as('coupons.remove')
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
