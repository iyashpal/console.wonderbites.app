/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

/*
|-------------------------------------------------------------------------
| Auth Routes
|-------------------------------------------------------------------------
| This file is dedicated for defining User Authentication routes. which we will use for
| frontend and mobile Application development as well as for admin panel SPA.
|
*/
import './routes/auth'

/*
|-------------------------------------------------------------------------
| Web Routes
|-------------------------------------------------------------------------
| Below routes are used for Web Application and for authenticated users.
| 
*/
import './routes/web'

/*
|-------------------------------------------------------------------------
| API Routes
|-------------------------------------------------------------------------
| This file is dedicated for defining API routes. which we will use for
| frontend and mobile Application development as well as for admin panel SPA.
|
*/
import './routes/api'
