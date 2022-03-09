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

    Route.resource('products', 'API/ProductsController')

    Route.resource('productimages', 'API/ProductImagesController')

    Route.get('getcart', 'API/CartsController.getcart').as('getcart')

    //Route.resource('cart', 'API/CartsController');

    //Route.get('/product/{id}', "API/UsersController.show");

    //Route.get('/products/productbycategory', "API/ProductsController.productbycategory").as('productbycategory');
  }).middleware('auth_api')
  Route.resource('categories', 'API/CategoriesController')
  Route.resource('banners', 'API/BannersController')
  Route.get('about', 'API/HomeController.about').as('about')

  Route.get('terms', 'API/HomeController.terms').as('terms')

  Route.get('privacy_policy', 'API/HomeController.privacy_policy').as('privacy_policy')

  Route.get('content_policy', 'API/HomeController.content_policy').as('content_policy')

  Route.get('settings', 'API/HomeController.settings').as('settings')

  Route.get('my_subscriptions', 'API/HomeController.my_subscriptions').as('my_subscriptions')
}).prefix('/api').as('api')
