import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
    product_id: schema.number.optional([
      rules.exists({table: 'products', column: 'id'}),
    ]),
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(100),
    ]),
    description: schema.string.nullableAndOptional({ trim: true }),
    thumbnail: schema.file.optional({
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      size: '1mb',
    }),
    price: schema.string({ trim: true }, [
      rules.required(),
    ]),
    proteins: schema.string({ trim: true }, [
      rules.required(),
    ]),
    vegetables: schema.string({ trim: true }, [
      rules.required(),
    ]),
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
