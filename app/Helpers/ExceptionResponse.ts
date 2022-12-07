import { ResponseContract } from '@ioc:Adonis/Core/Response'

export default class ExceptionResponse {
  public name: string

  public help?: string

  public code?: string

  public status: number

  public stack?: string

  public message: string

  public messages?: any[]

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

  public resolve (resolveType: string = 'json') {
    switch (resolveType) {
      case 'json':
        return this.json()
    }
  }

  private json () {
    this.response.status(this.status).json({
      name: this.name,
      code: this.code,
      help: this.help,
      status: this.status,
      message: this.message,
      messages: this.messages,
    })
  }
}
