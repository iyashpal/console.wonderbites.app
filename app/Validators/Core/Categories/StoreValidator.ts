import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'

export default class StoreValidator {
  constructor (protected ctx: HttpContextContract) {}

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
    name: schema.string({trim: true}, [
      rules.required(),
    ]),
    description: schema.string.optional({trim: true}),
    type: schema.string({trim: true}, [
      rules.required(),
    ]),
    parent: schema.number.optional([
      rules.exists({table: 'categories', column: 'id'}),
    ]),
    thumbnail: schema.file.optional({
      size: '1mb',
      extnames: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
    }),
    status: schema.string(),
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
