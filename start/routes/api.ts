import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {


    Route.group(() => {

        Route.post('/login', 'API/LoginController.login').as('login')

        Route.post('/register', 'API/RegisterController.register').as('register')

    }).middleware('guest')


    Route.group(() => {
        
        Route.post('/logout', "API/LoginController.logout").as('logout')

        Route.get('/users', "API/UsersController.show").as('user')
        Route.put('/users', "API/UsersController.update").as('user.update')

        Route.resource('addresses', 'API/Profile/AddressesController');

        Route.resource('cuisines', 'API/CuisinesController');

        Route.resource('categories', 'API/CateogriesController');

        Route.resource('products', 'API/ProductsController');
        //Route.resource('cart', 'API/CartsController');  
        Route.resource('productimages', 'API/ProductImagesController');
        Route.get('getcart', "API/CartsController.getcart").as('getcart')

        //Route.get('/product/{id}', "API/UsersController.show");
        //Route.get('/products/productbycategory', "API/ProductsController.productbycategory").as('productbycategory');

    }).middleware('auth:web')


}).prefix('/api').as('api')
