import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
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
    coupon_id: schema.number.optional([
      rules.exists({table: 'coupons', column: 'id'}),
    ]),
    user_id: schema.number.optional([
      rules.exists({table: 'users', column: 'id'}),
    ]),
    data: schema.array.optional().members(
      schema.object().members({
        id: schema.number([
          rules.exists({table: 'products', column: 'id'}),
        ]),
        quantity: schema.number(),
        variant: schema.object.optional().members({
          id: schema.number([
            rules.exists({table: 'variants', column: 'id'}),
          ]),
          ingredients: schema.array.optional().members(
            schema.object().members({
              id: schema.number([
                rules.exists({table: 'ingredients', column: 'id'}),
              ]),
              category: schema.number([
                rules.exists({table: 'categories', column: 'id'}),
              ]),
              quantity: schema.number(),
            })
          ),
        }),
        ingredients: schema.array.optional().members(
          schema.object().members({
            id: schema.number([
              rules.exists({table: 'ingredients', column: 'id'}),
            ]),
            quantity: schema.number(),
            category: schema.number([
              rules.exists({table: 'categories', column: 'id'}),
            ]),
          })
        ),
      })
    ),
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
