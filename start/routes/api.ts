import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'API/LoginController.login').as('login')

    Route.post('/register', 'API/RegisterController.register').as('register')
  }).middleware('guest_api')

  Route.group(() => {
    Route.post('/logout', 'API/LoginController.logout').as('logout')

    Route.get('/users', 'API/UsersController.show').as('user')

    Route.put('/users', 'API/UsersController.update').as('user.update')

    Route.resource('addresses', 'API/Profile/AddressesController')

    Route.resource('cuisines', 'API/CuisinesController')

    Route.resource('categories', 'API/CategoriesController')

    Route.resource('products', 'API/ProductsController')

    Route.resource('productimages', 'API/ProductImagesController')

<<<<<<< HEAD
        Route.resource('addresses', 'API/Profile/AddressesController');
        Route.resource('wishlists', 'API/WishlistsController');
=======
    Route.get('getcart', 'API/CartsController.getcart').as('getcart')

    //Route.resource('cart', 'API/CartsController');

    //Route.get('/product/{id}', "API/UsersController.show");

    //Route.get('/products/productbycategory', "API/ProductsController.productbycategory").as('productbycategory');
  }).middleware('auth_api')
>>>>>>> 42574a57503316e2da17efe7ca823b9c61e5a6a7

  Route.get('about', 'API/HomeController.about').as('about')

<<<<<<< HEAD
    }).middleware('auth_api')
    Route.resource('cart', 'API/CartsController');
    Route.resource('cuisines', 'API/CuisinesController');
    Route.get('/getcart/:device_token', 'API/CartsController.getcart').as('getcart')
   // Route.get('/getcart', "API/CartsController.getcart").as('getcart')
   Route.resource('categories', 'API/CategoriesController');

    Route.resource('products', 'API/ProductsController');

    Route.resource('productimages', 'API/ProductImagesController');

    Route.get('about', "API/HomeController.about").as('about')

    Route.get('terms', "API/HomeController.terms").as('terms')

    Route.get('privacy_policy', "API/HomeController.privacy_policy").as('privacy_policy')

    Route.get('content_policy', "API/HomeController.content_policy").as('content_policy')

    Route.get('change_email', "API/HomeController.change_email").as('change_email')

    Route.get('delete_account', "API/HomeController.delete_account").as('delete_account')

    Route.get('my_subscriptions', "API/HomeController.my_subscriptions").as('my_subscriptions')
=======
  Route.get('terms', 'API/HomeController.terms').as('terms')

  Route.get('privacy_policy', 'API/HomeController.privacy_policy').as('privacy_policy')

  Route.get('content_policy', 'API/HomeController.content_policy').as('content_policy')
>>>>>>> 42574a57503316e2da17efe7ca823b9c61e5a6a7

  Route.get('settings', 'API/HomeController.settings').as('settings')

  Route.get('my_subscriptions', 'API/HomeController.my_subscriptions').as('my_subscriptions')
}).prefix('/api').as('api')
