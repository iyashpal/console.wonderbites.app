import Route from '@ioc:Adonis/Core/Route'
Route.group(() => {
  Route.resource('cuisines', 'API/CuisinesController')
  //Route.resource('blogs', 'API/BlogsController').as('blogs')
  Route.get('blogs', 'API/BlogsController.index').as('blogs')
  Route.get('blogs/:slug', 'API/BlogsController.showBlogBySlug').as('blogslug')

  Route.resource('categoryblog', 'API/CategoryBlogController').as('categoryblog')

  //Route.resource('blogs', 'API/BlogsController').as('blogs')

  Route.resource('categories', 'API/CategoriesController').as('categories')

  Route.resource('testimonials', 'API/TestimonialsController').as('testimonials')

  Route.resource('banners', 'API/BannersController')
  Route.resource('teams', 'API/TeamsController').as('teams')
  Route.get('about', 'API/HomeController.about').as('about')

  Route.resource('products', 'API/ProductsController')

  Route.get('getcart', 'API/CartsController.getcart').as('getcart')

  Route.get('terms', 'API/HomeController.terms').as('terms')

  Route.get('privacy_policy', 'API/HomeController.privacy_policy').as('privacy_policy')

  Route.get('content_policy', 'API/HomeController.content_policy').as('content_policy')

  Route.get('settings', 'API/HomeController.settings').as('settings')

  Route.get('my_subscriptions', 'API/HomeController.my_subscriptions').as('my_subscriptions')

  Route.group(() => {
    Route.post('/login', 'API/LoginController.login').as('login')
    Route.post('/loginUser', 'API/LoginController.loginUser').as('loginUser')

    

    Route.post('/register', 'API/RegisterController.register').as('register')
    Route.post('/signup', 'API/RegisterController.signup').as('signup')
    Route.post('job-apply', 'API/JobApplicationsController.apply').as('jobapply')
    Route.post('contacts', 'API/ContactsController.send').as('contacts')
  }).middleware('guest_api')

  Route.group(() => {
    Route.post('/logout', 'API/LoginController.logout').as('logout')

    Route.get('/users', 'API/UsersController.show').as('user')

    Route.put('/users', 'API/UsersController.update').as('user.update')

    Route.resource('addresses', 'API/Profile/AddressesController')

    Route.resource('wishlists', 'API/WishlistsController')

    Route.post('products/:id/category', 'API/ProductsController.toggleCategory').as('products.category')
  }).middleware('auth_api')
}).prefix('/api').as('api')
