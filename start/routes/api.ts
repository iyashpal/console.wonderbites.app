import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  /**
       * Routes that allowed only for a logged in user.
       */
  Route.group(() => {
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

    Route.group(() => {
      Route.get('wonderpoints', 'WonderpointsController.index').as('index')
      Route.post('wonderpoints', 'WonderpointsController.store').as('store')
      Route.get('wonderpoints/avail', 'WonderpointsController.availWonderpoints').as('avail')
    }).as('wonderpoints')
  }).middleware('api.auth')

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

    /**
             * Coupon Routes
             */
    Route.group(() => {
      Route.get('coupons', 'CouponsController.index').as('index')
      Route.post('coupons', 'CouponsController.store').as('store')
      Route.get('coupons/:id', 'CouponsController.show').as('show')
      Route.put('coupons/:id', 'CouponsController.update').as('update')
      Route.delete('coupons/:id', 'CouponsController.destroy').as('destroy')
    }).as('coupons').middleware('api.auth')

    Route.post('coupons/apply', 'CouponsController.apply').as('coupons.apply')

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
