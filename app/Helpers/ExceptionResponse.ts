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
   * Exception messages (specifically used for validation errors.)
   * 
   * @var any[]
   */
  public messages?: any[]

  /**
   * Request response instance.
   * 
   * @var ResponseContract
   */
  protected response: ResponseContract

  constructor (response: ResponseContract, error: any) {
    this.response = response
    this.name = error.name
    this.help = error.help
    this.code = error.code
    this.stack = error.stack
    this.status = error.status
    this.message = error.message
    this.messages = error.messages
  }

  /**
   * Resolve the request response.
   * 
   * @param resolveType Exception response type.
   * @returns void
   */
  public resolve (data?: any, resolveType: string = 'json') {
    switch (resolveType) {
      case 'json':
        return this.json(data)
    }
  }

  /**
   * Return the json response.
   * 
   * @param data any
   */
  private json (data: any) {
    this.response.status(this.status)
      .json({
        name: this.name, code: this.code, help: this.help, status: this.status,
        message: this.message, messages: this.messages, ...data,
      })
  }
}
