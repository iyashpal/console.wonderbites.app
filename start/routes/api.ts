import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
  /**
   * Routes that allowed only for guest users.
   */
  Route.group(() => {
    Route.post('/login', 'Auth/LoginController.login').as('login')

    Route.post('/register', 'Auth/RegisterController.register').as('register')

    Route.post('/signup', 'Auth/RegisterController.signup').as('signup')
  }).middleware('guest_api')

  /**
   * Routes that allowed only for a logged in user.
   */
  Route.group(() => {
    Route.post('/logout', 'LoginController.logout').as('logout')

    Route.get('/users', 'UsersController.show').as('user')

    Route.put('/users', 'UsersController.update').as('user.update')

    Route.resource('addresses', 'Profile/AddressesController')

    /**
     * Orders Routes.
     */
    Route.group(() => {
      Route.post('orders', 'OrdersController.store').as('store')
    }).as('orders')

    /**
     * Wishlist Routes
     */
    Route.group(() => {
      Route.get('wishlists', 'WishlistsController.show').as('show')
      Route.post('wishlists', 'WishlistsController.update').as('update')
    }).as('wishlists')

    Route.post('products/:id/category', 'ProductsController.toggleCategory').as('products.category')
  }).middleware('auth_api')

  /**
   * Routes that allowed for everyone (guest|logged in) users.
   */
  Route.group(() => {
    /**
     * Cart Routes
     */
    Route.group(() => {
      Route.get('cart', 'CartsController.show').as('show')
      Route.post('cart', 'CartsController.update').as('update')
    }).as('carts')

    Route.group(() => {
      Route.post('coupons/apply', 'CouponsController.apply').as('apply')
    }).as('coupons')

    Route.resource('cuisines', 'CuisinesController')

    //Route.resource('blogs', 'BlogsController').as('blogs')
    Route.get('blogs', 'BlogsController.index').as('blogs')

    Route.get('blogs/:slug', 'BlogsController.showBlogBySlug').as('blogslug')

    Route.resource('categoryblog', 'CategoryBlogController').as('categoryblog')

    //Route.resource('blogs', 'BlogsController').as('blogs')

    Route.resource('categories', 'CategoriesController').as('categories')

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
