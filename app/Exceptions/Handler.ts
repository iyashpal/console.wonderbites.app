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

  public async handle (error: any, httpContext: HttpContextContract) {
    /**
     * Handle the validation exception for APIs.
     */
    if (httpContext.request.url().startsWith('/api')) {
      return this.handleAPI(error, httpContext)
    }

    return super.handle(error, httpContext)
  }

  protected handleAPI (error: any, httpContext: HttpContextContract) {
    const response = httpContext.response.status(error.code)

    switch (error.code) {
      case 'E_VALIDATION_FAILURE':
        return response.send(new ValidationErrors(error.messages))
      case 'E_AUTHORIZATION_FAILURE':
        return response.send({name: 'AuthorizationException', message: 'Unauthorized access'})
      case 'E_INVALID_AUTH_PASSWORD':
        return response.send({code: 'E_INVALID_AUTH_PASSWORD', message: 'Password mis-match'})
      default:
        return super.handle(error, httpContext)
    }
  }
}
