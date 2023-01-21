/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for the majority of projects, however you can define routes in different
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
import Route from '@ioc:Adonis/Core/Route'

/*
|-------------------------------------------------------------------------
| API Routes
|-------------------------------------------------------------------------
| This file is dedicated for defining API routes. which we will use for
| frontend and mobile Application development as well as for admin panel SPA.
|
*/
import './routes/api'

/*
|-------------------------------------------------------------------------
| Core API Routes
|-------------------------------------------------------------------------
| This file is dedicated for defining the core API routes. which we will use for
| management console operations.
|
*/
import './routes/core'

/*
|-------------------------------------------------------------------------
| SPA Routes
|-------------------------------------------------------------------------
| This section is dedicated for defining SPA routes.
|
*/
Route.on('*').render('app')
