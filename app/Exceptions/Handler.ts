/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import { ValidationErrors } from 'App/Helpers/Validation'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '403': 'errors/unauthorized',
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor () {
    super(Logger)
  }

  public async handle (error: any, ctx: HttpContextContract) {
    /**
     * Handle the validation exception for APIs.
     */
    if (ctx.request.url().startsWith('/api')) {
      return this.handleAPI(error, ctx)
    }

    return super.handle(error, ctx)
  }

  protected handleAPI (error: any, ctx: HttpContextContract) {
    switch (error.code) {
      case 'E_VALIDATION_FAILURE':
        return ctx.response.status(422).send(new ValidationErrors(error.messages))
      case 'E_AUTHORIZATION_FAILURE':
        return ctx.response.status(403).send({name: 'AuthorizationException', message: 'Unauthorized access'})
      default:
        return super.handle(error, ctx)
    }
  }
}
