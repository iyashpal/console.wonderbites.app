import Env from '@ioc:Adonis/Core/Env'

type ErrorField = { [key: string]: string[] }
type ResolvedErrorField = { [key: string]: string }
type JsonErrorField = { errors: { field: string, message: string, rule: string }[] }

export default class ErrorJSON {
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
  public errors?: { [key: string]: string }

  /**
   * Exception messages (specifically used for validation errors.)
   *
   * @var any[]
   */
  public messages: any

  constructor (error: any) {
    this.name = error?.name ?? undefined
    this.code = error?.code ?? undefined
    this.status = error?.status ?? undefined
    this.message = error?.message ?? undefined
    if (Env.get('APP_DEBUG')) {
      this.stack = error?.stack ?? undefined
    }
    this.errors = error?.messages ? this.getErrors(error.messages) : undefined
  }

  protected getErrors (messages: any): ResolvedErrorField {
    if (messages?.errors) {
      return this.resolveJsonAcceptedErrors(messages)
    }

    return this.resolveErrors(messages)
  }

  protected resolveJsonAcceptedErrors ({errors}: JsonErrorField): ResolvedErrorField {
    let resolvedErrors: ResolvedErrorField = {}
    for (let error of errors) {
      resolvedErrors = {...resolvedErrors, ...{[error.field]: error.message}}
    }

    return resolvedErrors
  }

  /**
   * Resolve the exception validation errors.
   *
   * @returns void
   */
  protected resolveErrors (errors: ErrorField): ResolvedErrorField {
    let resolvedErrors: ResolvedErrorField = {}
    for (let field in errors) {
      resolvedErrors = {...resolvedErrors, ...{[field]: errors[field][0]}}
    }

    return resolvedErrors
  }
}
