import { ResponseContract } from '@ioc:Adonis/Core/Response'

export default class ExceptionResponse {
  /**
   * Exception name
   * 
   * @var string
   */
  public name: string

  /**
   * Exception debug help.
   * 
   * @var string
   */
  public help?: string

  /**
   * Exception code defined in framework.
   * 
   * @var string
   */
  public code?: string

  /**
   * Exception status code.
   * 
   * @var number
   */
  public status: number

  /**
   * Exception files stack.
   * 
   * @var string
   */
  public stack?: string

  /**
   * Exception error message.
   * 
   * @var string
   */
  public message: string

  /**
   * Exception errors
   * 
   * @var object
   */
  public errors: { [key: string]: string } = {}

  /**
   * Exception messages (specifically used for validation errors.)
   * 
   * @var any[]
   */
  public messages: { errors?: { rule: string, field: string, message: string }[] }

  /**
   * Request response instance.
   * 
   * @var ResponseContract
   */
  protected response: ResponseContract

  constructor (error: any) {
    this.name = error.name
    this.help = error.help
    this.code = error.code
    this.stack = error.stack
    this.status = error.status
    this.message = error.message
    this.messages = error.messages

    this.resolveErrors()
  }

  /**
   * Consume the exception response dependencies.
   * 
   * @param response Request response contract.
   * @param error Cached error
   * @returns ExceptionResponse
   */
  public static use (error: any = {}) {
    return new ExceptionResponse(error)
  }

  /**
   * Resolve the request response.
   * 
   * @param resolveType Exception response type.
   * @returns void
   */
  public resolve (response: ResponseContract, data?: any) {
    response.status(this.status)

    if (data && typeof data === 'function') {
      data(response, this.json(data))
    } else {
      response.json(this.json(data))
    }
  }

  /**
   * Resolve the exception validation errors.
   * 
   * @returns void
   */
  protected resolveErrors (): void {
    if (typeof this.messages?.errors === 'object') {
      for (let error of this.messages.errors) {
        // Determine if the error field is defined or not.
        if (!this.errors.hasOwnProperty(error.field)) {
          this.errors = { ...this.errors, ...{ [error.field]: error.message } }
        }
      }
    }
  }

  /**
   * Return the json response.
   * 
   * @param data any
   */
  private json (data: any) {
    return {
      ...(this.name ? { name: this.name } : {}),
      ...(this.help ? { help: this.help } : {}),
      ...(this.code ? { code: this.code } : {}),
      ...(this.status ? { status: this.status } : {}),
      ...(this.message ? { message: this.message } : {}),
      ...(data ? data : {}),
      errors: this.errors,
    }
  }
}
