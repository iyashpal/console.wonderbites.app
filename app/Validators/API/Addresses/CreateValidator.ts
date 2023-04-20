import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateValidator {
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
    firstName: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),

    lastName: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),

    street: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),

    city: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),

    location: schema.object.optional().members({
      lat: schema.string(),
      lng: schema.string(),
    }),

    phone: schema.string({ trim: true }, [
      rules.maxLength(20),
    ]),

    type: schema.string({ trim: true }),

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
  public messages: CustomMessages = {
    'firstName.required': 'First name is required',
    'firstName.maxLength': 'Maximum 255 characters allowed only',
    'lastName.required': 'Last name is required',
    'lastName.maxLength': 'Maximum 255 characters allowed only',
    'street.required': 'Street is required',
    'street.maxLength': 'Maximum 255 characters allowed only',
    'city.required': 'City is required',
    'city.maxLength': 'Maximum 255 characters allowed only',
    'phone.required': 'Phone is required',
    'phone.maxLength': 'Maximum 20 characters allowed only',
    'type.required': 'Address type is required',
  }
}
