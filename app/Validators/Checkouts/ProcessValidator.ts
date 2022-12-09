import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProcessValidator {
  constructor (protected ctx: HttpContextContract) { }

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
    cart: schema.number([
      rules.required(),
      rules.exists({ table: 'carts', column: 'id' }),
    ]),
    address: schema.object([rules.required()])
      .members({
        first_name: schema.string({trim: true}, [rules.required()]),
        last_name: schema.string.optional({trim: true}),
        street: schema.string({trim: true}, [rules.required()]),
        city: schema.string({trim: true}, [rules.required()]),
        contact: schema.string({trim: true}, [rules.required()]),
        location: schema.object()
          .members({
            lat: schema.string.optional({trim: true}),
            lng: schema.string.optional({trim: true}),
          }),
      }),
    options: schema.object([rules.required()])
      .members({
        payment: schema.object([rules.required()])
          .members({
            mode: schema.string({trim: true}),
          }),
      }),
    note: schema.string.optional({trim: true}),
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
