import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    title: schema.string({trim: true}, [rules.required()]),
    description: schema.string.optional({trim: true}),
    attachment: schema.file({
      size: '1024kb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
    }, [rules.required()]),
    page: schema.string({trim: true}, [rules.required()]),
    section: schema.string({trim: true}, [rules.required()]),
    type: schema.string({trim: true}, [rules.required()]),
    link: schema.string.nullableAndOptional({trim: true}),
    status: schema.string({trim: true}, [rules.required()]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
