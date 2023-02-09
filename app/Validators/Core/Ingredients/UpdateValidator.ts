import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
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
    name: schema.string({trim: true}, [
      rules.required(),
      rules.maxLength(100),
    ]),
    description: schema.string({trim: true}, [
      rules.nullable(),
      rules.maxLength(255),
    ]),
    price: schema.string({trim: true}, [
      rules.required(),
      rules.maxLength(10),
    ]),
    unit: schema.string({trim: true}, [
      rules.required(),
      rules.maxLength(10),
    ]),
    quantity: schema.number([
      rules.required(),
    ]),
    minQuantity: schema.number([
      rules.required(),
    ]),
    maxQuantity: schema.number([
      rules.required(),
    ]),
    thumbnail: schema.file({
      size: '1mb',
      extnames: ['jpg', 'gif', 'png', 'jpeg', 'svg'],
    }, [
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
