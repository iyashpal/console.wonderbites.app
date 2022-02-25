

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {

    Route.post('/login', 'API/LoginController.login').as('login')

    Route.post('/logout', "API/LoginController.logout").as('logout')

    Route.post('/register', 'API/RegisterController.register').as('register')

    Route.get('/users', "API/UsersController.show").as('user')

    Route.resource('addresses', 'API/Profile/AddressesController');

    Route.resource('cuisines', 'API/CuisinesController');
   
    Route.resource('categories', 'API/CateogriesController');

    Route.resource('products', 'API/ProductsController');
    Route.resource('cart', 'API/CartsController');  
    Route.resource('productimages', 'API/ProductImagesController');
    //Route.get('/product/{id}', "API/UsersController.show");
    //Route.get('/products/productbycategory', "API/ProductsController.productbycategory").as('productbycategory');
  
}).prefix('/api').as('api')
